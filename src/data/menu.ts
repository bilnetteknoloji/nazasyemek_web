/**
 * Örnek dört haftalık tabldot menüsü.
 * TODO: Müşteriden gelen güncel menü ile değiştirilecek; yapı aynı kalır.
 */

export type Meal = {
  day: string;
  soup: string;
  main: string;
  side: string;
  extra: string;
  calories: number;
};

export type MenuWeek = {
  id: string;
  label: string;
  days: Meal[];
};

export const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"] as const;

export const menuWeeks: MenuWeek[] = [
  {
    id: "hafta-1",
    label: "1. Hafta",
    days: [
      {
        day: "Pazartesi",
        soup: "Ezogelin Çorbası",
        main: "Etli Kuru Fasulye",
        side: "Pirinç Pilavı",
        extra: "Cacık",
        calories: 980,
      },
      {
        day: "Salı",
        soup: "Domates Çorbası",
        main: "Fırın Tavuk Baget",
        side: "Bulgur Pilavı",
        extra: "Mevsim Salata",
        calories: 1020,
      },
      {
        day: "Çarşamba",
        soup: "Mercimek Çorbası",
        main: "Karnıyarık",
        side: "Şehriyeli Pirinç Pilavı",
        extra: "Yoğurt",
        calories: 1050,
      },
      {
        day: "Perşembe",
        soup: "Yayla Çorbası",
        main: "Etli Nohut",
        side: "Makarna",
        extra: "Turşu",
        calories: 940,
      },
      {
        day: "Cuma",
        soup: "Tarhana Çorbası",
        main: "Fırında Köfte",
        side: "Patates Püresi",
        extra: "İrmik Helvası",
        calories: 1120,
      },
    ],
  },
  {
    id: "hafta-2",
    label: "2. Hafta",
    days: [
      {
        day: "Pazartesi",
        soup: "Şehriye Çorbası",
        main: "Tavuk Sote",
        side: "Bulgur Pilavı",
        extra: "Ayran",
        calories: 970,
      },
      {
        day: "Salı",
        soup: "Brokoli Çorbası",
        main: "Etli Türlü",
        side: "Pirinç Pilavı",
        extra: "Mevsim Salata",
        calories: 990,
      },
      {
        day: "Çarşamba",
        soup: "Mercimek Çorbası",
        main: "Fırın Makarna",
        side: "Zeytinyağlı Barbunya",
        extra: "Yoğurt",
        calories: 1010,
      },
      {
        day: "Perşembe",
        soup: "Düğün Çorbası",
        main: "İzmir Köfte",
        side: "Şehriyeli Pilav",
        extra: "Cacık",
        calories: 1080,
      },
      {
        day: "Cuma",
        soup: "Ezogelin Çorbası",
        main: "Fırında Balık",
        side: "Roka Salata",
        extra: "Sütlaç",
        calories: 1040,
      },
    ],
  },
  {
    id: "hafta-3",
    label: "3. Hafta",
    days: [
      {
        day: "Pazartesi",
        soup: "Tarhana Çorbası",
        main: "Etli Kabak Dolma",
        side: "Bulgur Pilavı",
        extra: "Yoğurt",
        calories: 1000,
      },
      {
        day: "Salı",
        soup: "Mercimek Çorbası",
        main: "Tavuk Şiş",
        side: "Pirinç Pilavı",
        extra: "Piyaz",
        calories: 1060,
      },
      {
        day: "Çarşamba",
        soup: "Yayla Çorbası",
        main: "Etli Bezelye",
        side: "Erişte",
        extra: "Turşu",
        calories: 950,
      },
      {
        day: "Perşembe",
        soup: "Domates Çorbası",
        main: "Fırın Tavuk But",
        side: "Fırın Patates",
        extra: "Mevsim Salata",
        calories: 1090,
      },
      {
        day: "Cuma",
        soup: "Sebze Çorbası",
        main: "Kıymalı Ispanak",
        side: "Şehriyeli Pilav",
        extra: "Revani",
        calories: 1070,
      },
    ],
  },
  {
    id: "hafta-4",
    label: "4. Hafta",
    days: [
      {
        day: "Pazartesi",
        soup: "Ezogelin Çorbası",
        main: "Etli Patlıcan Musakka",
        side: "Pirinç Pilavı",
        extra: "Cacık",
        calories: 1030,
      },
      {
        day: "Salı",
        soup: "Mantar Çorbası",
        main: "Tavuklu Pilav",
        side: "Mevsim Salata",
        extra: "Ayran",
        calories: 960,
      },
      {
        day: "Çarşamba",
        soup: "Mercimek Çorbası",
        main: "Etli Barbunya",
        side: "Bulgur Pilavı",
        extra: "Yoğurt",
        calories: 1000,
      },
      {
        day: "Perşembe",
        soup: "Tavuk Suyu Çorba",
        main: "Terbiyeli Köfte",
        side: "Makarna",
        extra: "Turşu",
        calories: 1050,
      },
      {
        day: "Cuma",
        soup: "Tarhana Çorbası",
        main: "Etli Lahana Sarma",
        side: "Pirinç Pilavı",
        extra: "Kemalpaşa Tatlısı",
        calories: 1110,
      },
    ],
  },
];
