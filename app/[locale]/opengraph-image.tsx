import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Image Converter";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const seoData = {
  ko: {
    title: "이미지 변환기",
    subtitle: "무료 온라인 이미지 포맷 변환 및 편집 도구",
    features: ["JPEG, PNG, WebP, AVIF 변환", "이미지 필터 적용", "100MB 지원"],
  },
  en: {
    title: "Image Converter",
    subtitle: "Free Online Image Format Conversion & Editing Tool",
    features: ["JPEG, PNG, WebP, AVIF Conversion", "Image Filters", "Up to 100MB"],
  },
};

export default async function Image({ params }: { params: { locale: string } }) {
  const locale = params.locale as "ko" | "en";
  const data = seoData[locale] || seoData.en;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            padding: "60px 80px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              backgroundColor: "#667eea",
              marginBottom: "24px",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#1a1a1a",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {data.title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "24px",
              color: "#666666",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            {data.subtitle}
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            {data.features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  color: "#444444",
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
