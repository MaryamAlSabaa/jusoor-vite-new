import React, { useState, useEffect } from "react";
import { User } from "../Entities/User";
import { EmergencyContact } from "../Entities/EmergencyContact";
// import { SendEmail } from "../integrations/Core";
import { Button, Card } from "../components";
import { AlertCircle, Phone, MapPin, Plus, Shield } from "lucide-react";

export default function Emergency() {
  const [user, setUser] = useState(null);
  const [isRTL, setIsRTL] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [sosTriggered, setSosTriggered] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsRTL(userData.language_preference === "ar");

      const emergencyContacts = await EmergencyContact.list();
      setContacts(emergencyContacts);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSOS = async () => {
    setSosTriggered(true);
    try {
      // Notify emergency contacts
      // for (const contact of contacts.filter(c => c.notify_on_sos)) {
      //   await SendEmail({
      //     to: contact.phone, // In production, use SMS service
      //     subject: `Emergency Alert from ${user.full_name}`,
      //     body: `${user.full_name} has triggered an emergency alert from Jusoor MS Companion App. Please check on them immediately.`
      //   });
      // }

      setTimeout(() => {
        setSosTriggered(false);
        alert(isRTL ? "تم إرسال التنبيه" : "Emergency alert sent");
      }, 3000);
    } catch (error) {
      console.error("Error sending SOS:", error);
      setSosTriggered(false);
    }
  };

  return (
    <div className="min-h-screen p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--error)" }}>
            {isRTL ? "الطوارئ" : "Emergency"}
          </h1>
          <p style={{ color: "var(--muted-text)" }}>
            {isRTL ? "الوصول السريع للمساعدة" : "Quick access to help"}
          </p>
        </div>

        {/* SOS Button */}
        <button
          onClick={handleSOS}
          disabled={sosTriggered}
          className="w-full p-12 rounded-2xl flex flex-col items-center justify-center transition-all shadow-lg"
          style={{
            backgroundColor: sosTriggered ? "var(--muted-text)" : "var(--error)",
            transform: sosTriggered ? "scale(0.95)" : "scale(1)"
          }}
        >
          <Shield className="w-20 h-20 mb-4 text-white" />
          <h2 className="text-3xl font-bold text-white mb-2">
            {sosTriggered ? (isRTL ? "جاري الإرسال..." : "Sending...") : "SOS"}
          </h2>
          <p className="text-white text-opacity-90">
            {isRTL ? "اضغط للمساعدة الفورية" : "Tap for immediate help"}
          </p>
        </button>

        {/* Hotlines */}
        <div>
          <h3 className="font-semibold mb-4" style={{ color: "var(--strong-text)" }}>
            {isRTL ? "خطوط المساعدة" : "Hotlines"}
          </h3>
          <div className="space-y-3">
            <a href="tel:999">
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all" style={{ backgroundColor: "var(--surface)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--error)", color: "white" }}>
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                        {isRTL ? "الطوارئ" : "Emergency Services"}
                      </h4>
                      <p className="text-sm" style={{ color: "var(--muted-text)" }}>999</p>
                    </div>
                  </div>
                </div>
              </Card>
            </a>

            <a href="tel:+97143948200">
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all" style={{ backgroundColor: "var(--surface)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--primary)", color: "white" }}>
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                        {isRTL ? "خط المساعدة MS" : "MS Helpline"}
                      </h4>
                      <p className="text-sm" style={{ color: "var(--muted-text)" }}>+971 4 394 8200</p>
                    </div>
                  </div>
                </div>
              </Card>
            </a>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--strong-text)" }}>
              {isRTL ? "جهات الاتصال للطوارئ" : "Emergency Contacts"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              style={{ color: "var(--primary)" }}
            >
              <Plus className="w-4 h-4 mr-1" />
              {isRTL ? "إضافة" : "Add"}
            </Button>
          </div>

          <div className="space-y-3">
            {contacts.map((contact) => (
              <a key={contact.id} href={`tel:${contact.phone}`}>
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-all" style={{ backgroundColor: "var(--surface)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold" style={{ color: "var(--strong-text)" }}>
                        {contact.name}
                      </h4>
                      <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                        {contact.relationship} • {contact.phone}
                      </p>
                    </div>
                    {contact.is_primary && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "var(--accent-30)", color: "var(--accent)" }}>
                        {isRTL ? "أساسي" : "Primary"}
                      </span>
                    )}
                  </div>
                </Card>
              </a>
            ))}
          </div>

          {contacts.length === 0 && (
            <Card className="p-12 text-center" style={{ backgroundColor: "var(--surface)" }}>
              <Phone className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--muted-text)" }} />
              <p style={{ color: "var(--muted-text)" }}>
                {isRTL ? "لا توجد جهات اتصال بعد" : "No contacts added yet"}
              </p>
            </Card>
          )}
        </div>

        {/* Location Sharing */}
        {user?.emergency_location_enabled && (
          <Card className="p-6" style={{ backgroundColor: "var(--primary-100)" }}>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
              <div>
                <h4 className="font-semibold mb-1" style={{ color: "var(--primary)" }}>
                  {isRTL ? "مشاركة الموقع مفعلة" : "Location Sharing Enabled"}
                </h4>
                <p className="text-sm" style={{ color: "var(--strong-text)" }}>
                  {isRTL 
                    ? "سيتم مشاركة موقعك مع جهات الاتصال للطوارئ عند الضغط على SOS"
                    : "Your location will be shared with emergency contacts when SOS is triggered"}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
