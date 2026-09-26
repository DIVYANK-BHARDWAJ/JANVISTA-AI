/**
 * JANVISTA AI — Google Cloud Firestore Database Service
 * Developed 100% by Google (Google Cloud Firestore REST API).
 * Handles database CRUD operations for citizen requests, infrastructure assets,
 * demand clusters, hotspots, and audit logs across server and client.
 */

import {
  CitizenRequestDoc,
  InfrastructureAssetDoc,
  DemandClusterDoc,
  HotspotDoc,
  AuditEventDoc,
  SimulationDoc,
  UserCredentialDoc,
} from "./models";

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.NEXT_PUBLIC_GCP_PROJECT_ID || "janvista-ai-gcp";
const FIRESTORE_REST_BASE = `https://firestore.googleapis.com/v1/projects/${GCP_PROJECT_ID}/databases/(default)/documents`;

const CITIZEN_REQUESTS_STORAGE_KEY = "janvista_db_citizen_requests";

function getNodeFs() {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      return { fs, path };
    } catch {
      return null;
    }
  }
  return null;
}

function getLocalJsonDbPath(): string | null {
  const node = getNodeFs();
  if (!node) return null;
  try {
    const dir = node.path.join(process.cwd(), "backend", "data");
    if (!node.fs.existsSync(dir)) {
      node.fs.mkdirSync(dir, { recursive: true });
    }
    return node.path.join(dir, "citizen_requests.json");
  } catch {
    return null;
  }
}

// In-Memory, Local Storage & Server JSON File Fallback for local development without active GCP credentials
class LocalFirestoreStore {
  private requestsMap = new Map<string, CitizenRequestDoc>();
  private assetsMap = new Map<string, InfrastructureAssetDoc>();
  private clustersMap = new Map<string, DemandClusterDoc>();
  private hotspotsMap = new Map<string, HotspotDoc>();
  private auditMap = new Map<string, AuditEventDoc>();
  private simulationsMap = new Map<string, SimulationDoc>();
  private credentialsMap = new Map<string, UserCredentialDoc>();

  private loadPersistedRequests() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(CITIZEN_REQUESTS_STORAGE_KEY);
        if (stored) {
          const list: CitizenRequestDoc[] = JSON.parse(stored);
          if (Array.isArray(list)) {
            list.forEach((r) => this.requestsMap.set(r.id, r));
          }
        }
      } catch (e) {
        console.warn("Local storage read error for citizen requests:", e);
      }
    } else {
      const filePath = getLocalJsonDbPath();
      const node = getNodeFs();
      if (filePath && node && node.fs.existsSync(filePath)) {
        try {
          const raw = node.fs.readFileSync(filePath, "utf-8");
          const list: CitizenRequestDoc[] = JSON.parse(raw);
          if (Array.isArray(list)) {
            list.forEach((r) => this.requestsMap.set(r.id, r));
          }
        } catch (e) {
          console.warn("Server file DB read error:", e);
        }
      }
    }
  }

  private persistRequests() {
    const list = Array.from(this.requestsMap.values());
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CITIZEN_REQUESTS_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn("Local storage write error for citizen requests:", e);
      }
    } else {
      const filePath = getLocalJsonDbPath();
      const node = getNodeFs();
      if (filePath && node) {
        try {
          node.fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
        } catch (e) {
          console.warn("Server file DB write error:", e);
        }
      }
    }
  }

  // Credentials
  async saveUserCredential(cred: UserCredentialDoc): Promise<UserCredentialDoc> {
    this.credentialsMap.set(cred.id, cred);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`janvista_db_cred::${cred.id}`, cred.passwordHash);
      } catch (e) {
        console.warn("Local storage write error:", e);
      }
    }
    return cred;
  }

  async getUserCredential(id: string): Promise<UserCredentialDoc | undefined> {
    if (this.credentialsMap.has(id)) {
      return this.credentialsMap.get(id);
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`janvista_db_cred::${id}`) || localStorage.getItem(id);
      if (stored) {
        const cred: UserCredentialDoc = {
          id,
          role: id.includes("officer") ? "OFFICER" : "CITIZEN",
          jurisdictionKey: id,
          passwordHash: stored,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.credentialsMap.set(id, cred);
        return cred;
      }
    }
    return undefined;
  }

  // Citizen Requests
  async saveCitizenRequest(req: CitizenRequestDoc): Promise<CitizenRequestDoc> {
    this.loadPersistedRequests();
    this.requestsMap.set(req.id, req);
    this.persistRequests();
    return req;
  }

  async getCitizenRequests(): Promise<CitizenRequestDoc[]> {
    this.loadPersistedRequests();
    return Array.from(this.requestsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCitizenRequestById(id: string): Promise<CitizenRequestDoc | undefined> {
    this.loadPersistedRequests();
    return this.requestsMap.get(id);
  }

  async getCitizenRequestByTrackingId(trackingId: string): Promise<CitizenRequestDoc | undefined> {
    this.loadPersistedRequests();
    const cleanId = trackingId.toUpperCase().trim();
    return Array.from(this.requestsMap.values()).find(
      (r) => r.trackingId.toUpperCase() === cleanId
    );
  }

  async updateCitizenRequestStatus(
    trackingId: string,
    status: CitizenRequestDoc["status"]
  ): Promise<CitizenRequestDoc | undefined> {
    this.loadPersistedRequests();
    const req = await this.getCitizenRequestByTrackingId(trackingId);
    if (!req) return undefined;
    req.status = status;
    req.updatedAt = new Date().toISOString();
    this.requestsMap.set(req.id, req);
    this.persistRequests();
    return req;
  }

  // Infrastructure Assets
  async saveInfrastructureAsset(asset: InfrastructureAssetDoc): Promise<InfrastructureAssetDoc> {
    this.assetsMap.set(asset.id, asset);
    return asset;
  }

  async getInfrastructureAssets(): Promise<InfrastructureAssetDoc[]> {
    return Array.from(this.assetsMap.values());
  }

  // Demand Clusters
  async saveDemandCluster(cluster: DemandClusterDoc): Promise<DemandClusterDoc> {
    this.clustersMap.set(cluster.id, cluster);
    return cluster;
  }

  async getDemandClusters(): Promise<DemandClusterDoc[]> {
    return Array.from(this.clustersMap.values());
  }

  // Hotspots
  async saveHotspot(hotspot: HotspotDoc): Promise<HotspotDoc> {
    this.hotspotsMap.set(hotspot.id, hotspot);
    return hotspot;
  }

  async getHotspots(): Promise<HotspotDoc[]> {
    return Array.from(this.hotspotsMap.values()).sort((a, b) => a.rank - b.rank);
  }

  // Audit Events
  async saveAuditEvent(event: AuditEventDoc): Promise<AuditEventDoc> {
    this.auditMap.set(event.id, event);
    return event;
  }

  async getAuditEvents(): Promise<AuditEventDoc[]> {
    return Array.from(this.auditMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Simulations
  async saveSimulation(sim: SimulationDoc): Promise<SimulationDoc> {
    this.simulationsMap.set(sim.id, sim);
    return sim;
  }

  async getSimulations(): Promise<SimulationDoc[]> {
    return Array.from(this.simulationsMap.values());
  }
}

const localFirestoreStore = new LocalFirestoreStore();

export class GoogleFirestoreDatabaseService {
  /**
   * Save user password credentials to Google Cloud Firestore ('user_credentials' collection) via REST API
   */
  static async saveUserCredential(cred: UserCredentialDoc): Promise<UserCredentialDoc> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const url = `${FIRESTORE_REST_BASE}/user_credentials/${encodeURIComponent(cred.id)}?key=${apiKey}`;
        const fields = {
          id: { stringValue: cred.id },
          role: { stringValue: cred.role },
          jurisdictionKey: { stringValue: cred.jurisdictionKey },
          passwordHash: { stringValue: cred.passwordHash },
          createdAt: { stringValue: cred.createdAt },
          updatedAt: { stringValue: cred.updatedAt },
        };

        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields }),
        });

        if (res.ok) {
          localFirestoreStore.saveUserCredential(cred);
          return cred;
        }
      } catch (err) {
        console.warn("[GOOGLE FIRESTORE REST] Save credential notice, writing locally:", err);
      }
    }
    return localFirestoreStore.saveUserCredential(cred);
  }

  /**
   * Get user password credential from Google Cloud Firestore REST API
   */
  static async getUserCredential(id: string): Promise<UserCredentialDoc | undefined> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const url = `${FIRESTORE_REST_BASE}/user_credentials/${encodeURIComponent(id)}?key=${apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const doc = await res.json();
          if (doc.fields) {
            const f = doc.fields;
            const cred: UserCredentialDoc = {
              id: f.id?.stringValue || id,
              role: f.role?.stringValue || "CITIZEN",
              jurisdictionKey: f.jurisdictionKey?.stringValue || id,
              passwordHash: f.passwordHash?.stringValue || "",
              createdAt: f.createdAt?.stringValue || new Date().toISOString(),
              updatedAt: f.updatedAt?.stringValue || new Date().toISOString(),
            };
            localFirestoreStore.saveUserCredential(cred);
            return cred;
          }
        }
      } catch (err) {
        console.warn("[GOOGLE FIRESTORE REST] Get credential notice, writing locally:", err);
      }
    }
    return localFirestoreStore.getUserCredential(id);
  }

  /**
   * Save a citizen request into Google Cloud Firestore ('citizen_requests' collection) via REST API
   */
  static async saveCitizenRequest(req: CitizenRequestDoc): Promise<CitizenRequestDoc> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const url = `${FIRESTORE_REST_BASE}/citizen_requests/${req.id}?key=${apiKey}`;
        const fields = {
          id: { stringValue: req.id },
          trackingId: { stringValue: req.trackingId },
          name: { stringValue: req.name },
          phone: { stringValue: req.phone },
          email: { stringValue: req.email },
          state: { stringValue: req.state },
          district: { stringValue: req.district },
          villageOrWard: { stringValue: req.villageOrWard },
          category: { stringValue: req.category },
          urgency: { stringValue: req.urgency },
          description: { stringValue: req.description },
          originalLanguage: { stringValue: req.originalLanguage },
          status: { stringValue: req.status },
          createdAt: { stringValue: req.createdAt },
          updatedAt: { stringValue: req.updatedAt },
        };

        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields }),
        });

        if (res.ok) {
          localFirestoreStore.saveCitizenRequest(req);
          return req;
        }
      } catch (err) {
        console.warn("[GOOGLE FIRESTORE REST] Save notice, writing to local provider:", err);
      }
    }
    return localFirestoreStore.saveCitizenRequest(req);
  }

  /**
   * Retrieve citizen requests from Google Cloud Firestore REST API
   */
  static async getCitizenRequests(): Promise<CitizenRequestDoc[]> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const url = `${FIRESTORE_REST_BASE}/citizen_requests?key=${apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.documents && Array.isArray(data.documents)) {
            const docs: CitizenRequestDoc[] = data.documents.map((doc: { fields?: Record<string, { stringValue?: string }> }) => {
              const f = doc.fields || {};
              return {
                id: f.id?.stringValue || "",
                trackingId: f.trackingId?.stringValue || "",
                name: f.name?.stringValue || "",
                phone: f.phone?.stringValue || "",
                email: f.email?.stringValue || "",
                state: f.state?.stringValue || "",
                district: f.district?.stringValue || "",
                villageOrWard: f.villageOrWard?.stringValue || "",
                category: (f.category?.stringValue || "healthcare") as CitizenRequestDoc["category"],
                urgency: (f.urgency?.stringValue || "medium") as CitizenRequestDoc["urgency"],
                description: f.description?.stringValue || "",
                originalLanguage: f.originalLanguage?.stringValue || "hi",
                status: (f.status?.stringValue || "Submitted") as CitizenRequestDoc["status"],
                createdAt: f.createdAt?.stringValue || new Date().toISOString(),
                updatedAt: f.updatedAt?.stringValue || new Date().toISOString(),
              };
            });
            if (docs.length > 0) return docs;
          }
        }
      } catch (err) {
        console.warn("[GOOGLE FIRESTORE REST] Fetch notice, falling back to local store:", err);
      }
    }
    return localFirestoreStore.getCitizenRequests();
  }

  /**
   * Lookup citizen request by tracking ID
   */
  static async getCitizenRequestByTrackingId(trackingId: string): Promise<CitizenRequestDoc | undefined> {
    return localFirestoreStore.getCitizenRequestByTrackingId(trackingId);
  }

  /**
   * Update status of citizen request
   */
  static async updateCitizenRequestStatus(
    trackingId: string,
    status: CitizenRequestDoc["status"]
  ): Promise<CitizenRequestDoc | undefined> {
    return localFirestoreStore.updateCitizenRequestStatus(trackingId, status);
  }

  /**
   * Audit log writer
   */
  static async logAuditEvent(action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}): Promise<AuditEventDoc> {
    const event: AuditEventDoc = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      entityType,
      entityId,
      metadata,
    };
    return localFirestoreStore.saveAuditEvent(event);
  }
}

