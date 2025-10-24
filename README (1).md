# PUSULA – Tam Erişilebilir Bankacılık Asistanı

**PUSULA**, herkes için tasarlanmış **tam erişilebilir** (engelsiz) bir bankacılık asistanıdır. Doğal konuşmayı anlayıp niyeti (intent) otomatik tespit eder; sesli komut, altyazı, yüksek kontrast, ölçeklenebilir metin ve dokunsal geri bildirim gibi **uyarlanabilir arayüzlerle** işlemleri adım adım yönlendirir.

## Günlük Akış

### 1) Kullanıcı Akışı (Günün İçinde)
```mermaid
flowchart LR
A[Uygulama Açılışı] --> B[Karşılama & Tercihler: ses/altyazı/büyük yazı]
B --> C[Sesli komut: "Ahmet'e 250 TL gönder"]
C --> D[STT: Konuşmayı yazıya çevir]
D --> E[PUSULA Agent: Niyet + Alan Doldurma]
E -->|Eksik bilgi| F[Netleştirme: "Hangi hesaptan?"]
E -->|Yeterli bilgi| G[Backend API: İşlem çağrısı]
G --> H[Sonuç: Onay + Özet]
H --> I[Sunum: Sesli yanıt + altyazı + haptik]
I --> J[İşlem Geçmişi & Kısa Yollar]
```

**Örnek senaryo:**  
- “Bakiye” → anlık bakiye okunur ve yazılı/altyazılı gösterilir.  
- “Para gönder” → alıcı doğrulama, miktar, hesap seçimi, şifreleme/kimlik doğrulama, onay, sonuç özeti.  
- “Kartımı kapat” → güvenlik doğrulaması → kart durumu güncelleme → sesli/yazılı bildirim.

### 2) Operasyon/Geliştirici Akışı (Gün Rutini)
- Sabah: **intent örnekleri** ve **test cümleleri** gözden geçirilir, yeni slot kuralları eklenir.  
- Öğlen: **erişilebilirlik denetimi** (kontrast, dinamik metin boyutu, ekran okuyucu etiketleri) ve **hata kayıtları** incelenir.  
- Akşam: **CI** (lint, unit test), **beta build** (Android/iOS), **dağıtım notları** hazırlanır.

## Mimari Özeti
```mermaid
flowchart LR
U[React Native Mobil İstemci] -- ses/klavye/dokunma --> STT[Azure Speech-to-Text]
STT --> NLU[PUSULA Agent (Azure OpenAI + LangChain)]
NLU --> API[Backend API (FastAPI/Node)]
API --> Core[Banka Servisleri (REST/JSON)]
Core --> API --> TTS[Azure Text-to-Speech]
TTS --> U
U --> Acc[Uyarlanabilir UI: altyazı, kontrast, haptik, büyük yazı]
```

**Katmanlar:**  
- **Mobil istemci:** React Native 0.82, React 19, Navigation 7, Reanimated 4, Accessibility API, WCAG 2.1 AA.  
- **Yapay zekâ katmanı:** Azure OpenAI (GPT-4o), LangChain; niyet tespiti ve alan doldurma.  
- **Sunucu katmanı:** FastAPI/Node.js; kimlik doğrulama (Azure AD/JWT), oran sınırlama, loglama.  
- **Konuşma servisleri:** Azure STT/TTS.

## Kullanılan Teknolojiler
- **AI & Konuşma:** Azure OpenAI (GPT-4o), Azure Cognitive Services (STT/TTS), LangChain  
- **Mobil:** React Native, React Navigation, Reanimated, Context API, AsyncStorage  
- **Sunucu:** Python (FastAPI) veya Node.js (REST)  
- **DevOps:** GitHub Actions, HTTPS/TLS, Azure AD/JWT

## Kurulum

### Gereksinimler
- Node.js 18+, Java 17 (Android), Android Studio (SDK/Emulator), Xcode (iOS için), Git  
- Azure erişimi: STT/TTS ve OpenAI kaynakları

### .env Örneği
```
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=westeurope
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o
BACKEND_BASE_URL=https://api.senin-domainin.com
```

### Çalıştırma
```bash
# Kurulum
npm i   # veya yarn

# Metro bundler
npm run start

# Android
npm run android

# iOS (macOS)
cd ios && pod install && cd ..
npm run ios
```

## Niyet/Slot JSON Örneği
```json
{
  "intent": "transfer_money",
  "slots": {
    "amount": "250 TRY",
    "to": "Ahmet Yılmaz",
    "account": "Vadesiz TL",
    "note": "kira",
    "confirm": true
  },
  "clarifications": []
}
```

## Erişilebilirlik İlkeleri
- **Eşdeğer deneyim:** Sesli komut ↔ altyazı ↔ metin; hepsiyle tamamlanabilir akış.  
- **Kontrast ve boyut:** WCAG 2.1 AA kontrast; dinamik metin büyütme.  
- **Odak sırası ve etiketler:** Ekran okuyucuya uygun `accessibilityLabel/Role`.  
- **Haptik geri bildirim:** Kritik adımlarda dokunsal onay.

## Güvenlik
- Azure AD/JWT ile **kimlik doğrulama**, tüm uç noktalarda **HTTPS/TLS**.  
- Oran sınırlama, IP/cihaz parmak izi (opsiyonel), kişisel veriler için **gizlilik** ve **maskeleme**.

## Test ve Doğrulama
- **Birim test:** intent eşleştirme ve slot çıkarımı.  
- **Kabul testi:** örnek cümle setleri (bakiye, transfer, kart, fatura).  
- **Erişilebilirlik testi:** ekran okuyucu (TalkBack/VoiceOver), kontrast, büyük yazı.

## Bilinen Durumlar
- STT/TTS bölge uyuşmazlığı → aynı region seç.  
- Mikrofona izin yoksa STT hata verir → sistem izinlerini aç.  
- >100 MB dosyalar için Git LFS kullan.

## Yol Haritası
- Çok dilli destek (TR/EN) için model seçimi  
- E2E testleri (Detox/Appium)  
- Offline kısmi çalışma (önbellek + transkript)

## Lisans
Bu proje hackathon/kapsayıcı bankacılık gösterimi içindir. Lisanslama kurumsal gereksinimlere göre netleştirilecektir.
