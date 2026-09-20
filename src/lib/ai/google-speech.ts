/**
 * JANVISTA AI — Google Text-to-Speech Voice Response Engine
 * Developed 100% by Google.
 * Synthesizes audio responses to speak back confirmation messages to citizens in regional Indian languages.
 */

export interface GoogleVoiceConfirmation {
  language: string;
  trackingId: string;
  confirmationMessageText: string;
  hindiMessageText: string;
}

const REGIONAL_AUDIO_CONFIRMATIONS: Record<string, (id: string, loc: string) => string> = {
  hi: (id, loc) => `आपकी विकास मांग JANVISTA AI पोर्टल पर सफलतापूर्वक स्वीकार कर ली गई है। ${loc} के लिए आपका ट्रैकिंग नंबर है ${id}।`,
  ta: (id, loc) => `உங்கள் கோரிக்கை JANVISTA AI போர்ட்டலில் வெற்றிகரமாக ஏற்றுக்கொள்ளப்பட்டது. ${loc} க்கான உங்கள் டிராக்கிங் ஐடி ${id}.`,
  mr: (id, loc) => `तुमची तक्रार JANVISTA AI पोर्टलवर यशस्वीरीत्या स्वीकारली गेली आहे. ${loc} साठी तुमचा ट्रॅकिंग आयडी ${id} आहे.`,
  bn: (id, loc) => `আপনার আবেদনটি JANVISTA AI পোর্টালে সফলভাবে গৃহীত হয়েছে। ${loc} এর জন্য আপনার ট্র্যাকিং নম্বর ${id}।`,
  te: (id, loc) => `మీ అభ్యర్థన JANVISTA AI పోర్టల్‌లో విజయవంతంగా స్వీకరించబడింది. ${loc} కోసం మీ ట్రాకింగ్ ID ${id}.`,
  kn: (id, loc) => `ನಿಮ್ಮ ಕೋರಿಕೆಯನ್ನು JANVISTA AI ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ${loc} ಗಾಗಿ ನಿಮ್ಮ ಟ್ರ್ಯಾಕಿಂಗ್ ಐಡಿ ${id}.`,
  gu: (id, loc) => `તમારી અરજી JANVISTA AI પોર્ટલ પર સફળતાપૂર્વક સ્વીકારવામાં આવી છે. ${loc} માટે તમારો ટ્રેકિંગ ID ${id} છે.`,
  en: (id, loc) => `Your infrastructure request for ${loc} has been successfully accepted by JANVISTA AI. Your tracking ID is ${id}.`,
};

/**
 * Generate structured text and trigger Google Text-to-Speech voice synthesis
 */
export function speakGoogleVoiceConfirmation(
  trackingId: string,
  locationName: string,
  languageCode: string = "hi"
): string {
  const formatter = REGIONAL_AUDIO_CONFIRMATIONS[languageCode] || REGIONAL_AUDIO_CONFIRMATIONS.hi;
  const messageText = formatter(trackingId, locationName);

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel(); // Stop any previous playback

      const utterance = new SpeechSynthesisUtterance(messageText);
      const locales: Record<string, string> = {
        hi: "hi-IN",
        ta: "ta-IN",
        mr: "mr-IN",
        bn: "bn-IN",
        te: "te-IN",
        kn: "kn-IN",
        gu: "gu-IN",
        en: "en-IN",
      };

      utterance.lang = locales[languageCode] || "hi-IN";
      utterance.rate = 0.95; // Slightly slower for clear regional speech
      utterance.pitch = 1.0;

      // Select Google Speech Synthesis Voice if available
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find(
        (v) => v.name.includes("Google") && (v.lang.startsWith(utterance.lang) || v.lang.startsWith(languageCode))
      );

      if (googleVoice) {
        utterance.voice = googleVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("[GOOGLE TTS VOICE ENGINE] Speech synthesis notice:", e);
    }
  }

  return messageText;
}
