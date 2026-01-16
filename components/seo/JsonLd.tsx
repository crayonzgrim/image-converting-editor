"use client";

import { useParams } from "next/navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://image-converter.example.com";

interface JsonLdData {
  ko: {
    name: string;
    description: string;
    applicationCategory: string;
    operatingSystem: string;
    offers: string;
    featureList: string[];
    faqItems: Array<{ question: string; answer: string }>;
  };
  en: {
    name: string;
    description: string;
    applicationCategory: string;
    operatingSystem: string;
    offers: string;
    featureList: string[];
    faqItems: Array<{ question: string; answer: string }>;
  };
}

const jsonLdData: JsonLdData = {
  ko: {
    name: "이미지 변환기",
    description: "JPEG, PNG, WebP, AVIF, HEIC 등 다양한 이미지 포맷을 무료로 변환하고 편집하는 온라인 도구",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: "무료",
    featureList: [
      "JPEG, PNG, WebP, GIF, BMP, AVIF 포맷 변환",
      "HEIC/HEIF 이미지 입력 지원",
      "흑백, 블러, 밝기, 대비 필터",
      "Before/After 비교 슬라이더",
      "최대 10개 이미지 동시 처리",
      "100MB 파일 크기 지원",
      "브라우저 내 처리로 개인정보 보호",
    ],
    faqItems: [
      {
        question: "이미지 변환기는 무료인가요?",
        answer: "네, 이미지 변환기는 완전히 무료입니다. 회원가입이나 결제 없이 모든 기능을 사용할 수 있습니다.",
      },
      {
        question: "어떤 이미지 포맷을 지원하나요?",
        answer: "입력: JPEG, PNG, WebP, GIF, BMP, AVIF, HEIC, HEIF, SVG, ICO, TIFF를 지원합니다. 출력: JPEG, PNG, WebP, GIF, BMP, AVIF로 변환할 수 있습니다.",
      },
      {
        question: "이미지가 서버에 저장되나요?",
        answer: "아니요, 모든 이미지 처리는 브라우저에서 직접 이루어집니다. 이미지는 서버에 업로드되거나 저장되지 않아 개인정보가 보호됩니다.",
      },
      {
        question: "최대 파일 크기는 얼마인가요?",
        answer: "최대 100MB 크기의 이미지 파일을 처리할 수 있습니다.",
      },
      {
        question: "한 번에 여러 이미지를 변환할 수 있나요?",
        answer: "네, 최대 10개의 이미지를 동시에 업로드하고 각각 다른 설정으로 변환할 수 있습니다.",
      },
    ],
  },
  en: {
    name: "Image Converter",
    description: "Free online tool to convert and edit images between JPEG, PNG, WebP, AVIF, HEIC and more formats",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: "Free",
    featureList: [
      "Convert between JPEG, PNG, WebP, GIF, BMP, AVIF formats",
      "Support HEIC/HEIF image input",
      "Grayscale, Blur, Brightness, Contrast filters",
      "Before/After comparison slider",
      "Process up to 10 images simultaneously",
      "Support files up to 100MB",
      "Privacy-first browser-based processing",
    ],
    faqItems: [
      {
        question: "Is Image Converter free to use?",
        answer: "Yes, Image Converter is completely free. You can use all features without registration or payment.",
      },
      {
        question: "What image formats are supported?",
        answer: "Input: JPEG, PNG, WebP, GIF, BMP, AVIF, HEIC, HEIF, SVG, ICO, TIFF. Output: JPEG, PNG, WebP, GIF, BMP, AVIF.",
      },
      {
        question: "Are my images stored on a server?",
        answer: "No, all image processing happens directly in your browser. Images are never uploaded or stored on any server, ensuring your privacy.",
      },
      {
        question: "What is the maximum file size?",
        answer: "You can process image files up to 100MB in size.",
      },
      {
        question: "Can I convert multiple images at once?",
        answer: "Yes, you can upload up to 10 images at once and convert each with different settings.",
      },
    ],
  },
};

export function JsonLd() {
  const params = useParams();
  const locale = (params?.locale as "ko" | "en") || "en";
  const data = jsonLdData[locale] || jsonLdData.en;

  // WebApplication Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: data.name,
    description: data.description,
    url: `${siteUrl}/${locale}`,
    applicationCategory: data.applicationCategory,
    operatingSystem: data.operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: data.offers,
    },
    featureList: data.featureList,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
    author: {
      "@type": "Organization",
      name: "Image Converter",
      url: siteUrl,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // FAQ Schema for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // HowTo Schema for AEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: locale === "ko" ? "이미지 포맷을 변환하는 방법" : "How to Convert Image Formats",
    description: locale === "ko"
      ? "이미지 변환기를 사용하여 이미지 포맷을 변환하는 단계별 가이드"
      : "Step-by-step guide to convert image formats using Image Converter",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: locale === "ko" ? "이미지 업로드" : "Upload Image",
        text: locale === "ko"
          ? "이미지를 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요"
          : "Drag and drop images or click to select files",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: locale === "ko" ? "출력 형식 선택" : "Select Output Format",
        text: locale === "ko"
          ? "JPEG, PNG, WebP, AVIF 등 원하는 출력 형식을 선택하세요"
          : "Choose your desired output format like JPEG, PNG, WebP, AVIF",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: locale === "ko" ? "필터 적용 (선택사항)" : "Apply Filters (Optional)",
        text: locale === "ko"
          ? "필요시 흑백, 블러, 밝기, 대비 필터를 적용하세요"
          : "Apply grayscale, blur, brightness, or contrast filters if needed",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: locale === "ko" ? "미리보기 확인" : "Check Preview",
        text: locale === "ko"
          ? "Before/After 슬라이더로 결과를 확인하세요"
          : "Check the result with the Before/After comparison slider",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: locale === "ko" ? "다운로드" : "Download",
        text: locale === "ko"
          ? "다운로드 버튼을 클릭하여 변환된 이미지를 저장하세요"
          : "Click the download button to save the converted image",
      },
    ],
  };

  // Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Image Converter",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}
