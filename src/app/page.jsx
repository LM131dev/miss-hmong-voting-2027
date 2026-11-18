"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { OFFICIAL_CONTESTANTS, EIGHT_PACKAGES } from "../lib/constants";
import {
  Crown,
  Sparkles,
  Search,
  MapPin,
  Heart,
  QrCode,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  User,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Flame,
  Zap,
  MessageSquareHeart,
  Share2,
  Trophy,
  ArrowUpRight,
  Ticket,
  Calendar,
  Handshake,
  BookOpen,
  Globe,
  Menu,
  Check,
  Award,
  Users,
  Leaf,
  Gem,
  Medal,
  Newspaper,
  Hash,
  MessageCircle,
  Send,
  PartyPopper,
  Banknote,
  Coins,
  DollarSign,
  Home,
  ArrowRight,
  Star,
  Phone,
  Mail,
  ExternalLink,
  Building2,
  Upload,
  Copy,
  Download,
  Image as ImageIcon,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

const PRIZE_TIERS = [
  {
    rank: "ຊິງຕຳແໜ່ງ & ເງິນລາງວັນລວມ (Total Prize Pool)",
    prize: "ລວມມູນຄ່າ 500 ກວ່າລ້ານກີບ",
    details: "ມົງກຸດເພັດກຽດຕິຍົດ, ສາຍສະພາຍປະຈຳຕຳແໜ່ງ, ເຄື່ອງປະດັບຈາກ ຮ້ານຄຳພູວົງ (Phouvong Jewelry) ແລະ ເງິນລາງວັນລວມມູນຄ່າຫຼາຍກວ່າ 500,000,000 ກີບ",
    highlight: true,
    iconType: "crown",
  },
  {
    rank: "ຮອງຊະນະເລີດ & ລາງວັນພິເສດປະຈຳກອງປະກວດ",
    prize: "ມົງກຸດຮອງຊະນະເລີດ + ສາຍສະພາຍ + ເງິນລາງວັນ",
    details: "ພ້ອມເຄື່ອງປະດັບກຽດຕິຍົດຈາກ ຮ້ານຄຳພູວົງ (Phouvong Jewelry) ແລະ ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden)",
    highlight: false,
    iconType: "medal",
  },
  {
    rank: "ລາງວັນຂວັນໃຈໂຊຊຽວມີເດຍ & ຂວັນໃຈມະຫາຊົນ (Fast Track)",
    prize: "1 Like = 1 ຄະແນນ • 1 Share = 1 ຄະແນນ + QR Vote",
    details: "ສຳລັບຜູ້ເຂົ້າປະກວດ HM 01 - HM 20 ທີ່ໄດ້ຮັບຄະແນນໂຫວດອອນລາຍສູງສຸດ ແລະ ຍອດ Like/Share ຈາກເພຈ ສວນບັນດາເຜົ່າ / Lao Ethnic Garden",
    highlight: false,
    iconType: "star",
  },
];

const VENUE_INFO = {
  nameLao: "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden (ສວນພຶກສາ • PHEUKSA)",
  address: "ບ້ານໃໝ່ດ່ານຊີ, ເມືອງນາຊາຍທອງ, ນະຄອນຫຼວງວຽງຈັນ (ເສັ້ນທາງເລກທີ 13 ເໜືອ)",
  phones: ["020 9689 9684", "+856 20 96 899 684"],
  email: "info@pheuksagarden.com",
  facebookUrl: "https://www.facebook.com/PHEUKSA",
  facebookPhotosUrl: "https://www.facebook.com/PHEUKSA/photos",
  websiteUrl: "http://www.pheuksagarden.com",
  photographer: "StarYang CU",
  jewelryPartner: "ຮ້ານຄຳພູວົງ Phouvong Jewelry",
  highlights: [
    "1. ມີລົດໄຟນຳທ່ຽວຊົມສວນບັນດາເຜົ່າ",
    "2. ເຂົ້າຊົມຫ້ອງວາງສະແດງບັນດາເຜົ່າ ພ້ອມໄກ້ນຳທ່ຽວ",
    "3. ຊົມເຮືອນຊົນເຜົ່າດັ້ງເດີມຫຼາຍກວ່າ 10 ຊົນເຜົ່າ",
    "4. ມີຕູບຊົນເຜົ່າກະຕູ ແລະ ຕູບເຜົ່າມົ້ງ",
    "5. ມີຮ້ານອາຫານ ແລະ ເຄື່ອງດື່ມຕາມສັ່ງ",
    "6. ທ່ຽວຊົມວັງພະຍານາກ & ຊົມສວນແບ້ຄຳນຳໂຊກ",
    "7. ສະໄລເດີ້ນ້ຳ ແລະ ຣີສອດພັກຜ່ອນຄົບວົງຈອນ",
  ],
  eligibilityRules: [
    "ເປັນເພດຍິງໂດຍສົມບູນ (ໂສດ, ແຕ່ງງານແລ້ວ, ແມ່ຮ້າງ-ແມ່ໝ້າຍ ຫຼື ຊິງເກິມໍ່າ)",
    "ອາຍຸລະຫວ່າງ 14 - 30 ປີ ແລະ ລວງສູງ 155 ຊັງຕີແມັດຂຶ້ນໄປ",
    "ລະດັບການສຶກສາ ຈົບຊັ້ນ ມ.4 ຂຶ້ນໄປ, ບຸກຄະລິກກະພາບດີ ແລະ ມະນຸດສຳພັນດີ",
    "ສາມາດເວົ້າ ແລະ ແນະນຳໂຕເອງເປັນພາສາມົ້ງ ແລະ ພາສາລາວໄດ້",
  ],
};

const PHEUKSA_GALLERY_PHOTOS = [
  {
    title: "ກິດຈະກຳເກັບໂຕ ມື້ທີ 2 (ພາກບ່າຍ) • ຍ່າງຊົມສວນໄผ່ ສວນບັນດາເຜົ່າ",
    subtitle: "ສາວງາມ 20 ໝາຍເລກ (HM 01 - HM 20) ໃນຊຸດເສື້ອໂປໂລສີຂາວ ພ້ອມສາຍສະພາຍປະຈຳໝາຍເລກ",
    url: "https://scontent.fvte3-1.fna.fbcdn.net/v/t39.30808-6/909693464_1614470244044713_6014579302863546548_n.jpg?stp=c256.0.1536.1536a_dst-jpg_tt6&cstp=mx1536x1536&ctp=s206x206&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeFN6W-0es7cw1ier9hvnQgrP2FPAdr1vio_YU8B2vW-KsLtffM5ikKAHPkeZzqayjteySNMFMyr1jIVVkuRNjkX&_nc_ohc=vQhqgP_9g44Q7kNvwGmHe73&_nc_oc=Adrk-sn_y5jzwp2QMFh7JfPuKorrgimfJQNjuU4jHVl4Xn6tZTzPEY7o_6ieurmA9c8&_nc_zt=23&_nc_ht=scontent.fvte3-1.fna&_nc_gid=v2HYOAKkBxDQiwb6G6pAMQ&_nc_ss=7b2a8&oh=00_AQRfC_vhkAWJCNQVw0ojm510IZg1UMqsBcQQvAlud4HYrA&oe=6AFF9691",
  },
  {
    title: "ບັນຍາກາດການເກັບໂຕ ແລະ ຖ່າຍຮູບໝູ່ ທ່າມກາງທຳມະຊາດ ສວນບັນດາເຜົ່າ",
    subtitle: "ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ ນະຄອນຫຼວງວຽງຈັນ",
    url: "https://scontent.fvte3-1.fna.fbcdn.net/v/t39.30808-6/906972970_1614470157378055_3398498704918780297_n.jpg?stp=c256.0.1536.1536a_dst-jpg_tt6&cstp=mx1536x1536&ctp=s206x206&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeF-UZZxul4FR8lFaaYTkJqnXgkUx2C8h0BeCRTHYLyHQETv3HZoqWAzMMeFVOOuX-AxAu1KhKa77FJhZ-gs_8WZ&_nc_ohc=BFRUtD5vofkQ7kNvwG3UuJt&_nc_oc=Adrbwe3syAJ_Nn6KDw-yZEX023FqPqx5KYewEmlmx7o7jk9Y0OsgWhHG5dgAh96q4uw&_nc_zt=23&_nc_ht=scontent.fvte3-1.fna&_nc_gid=v2HYOAKkBxDQiwb6G6pAMQ&_nc_ss=7b2a8&oh=00_AQSAU3y3oucH_wFjU0FEh1bN1rOTtGBI3o5iJLUkEDrlRw&oe=6AFFA827",
  },
  {
    title: "ກິດຈະກຳເກັບໂຕ ມື້ທີ 2 • ທັດສະນະສຶກສາເຮືອນຊົນເຜົ່າ ແລະ ວັງພະຍານາກ",
    subtitle: "ສົ່ງເສີມ ແລະ ອະນຸລັກວັດທະນະທຳຮີດຄອງປະເພນີຂອງແມ່ຍິງຊົນເຜົ່າມົ້ງ",
    url: "https://scontent.fvte3-1.fna.fbcdn.net/v/t39.30808-6/911567290_1614462184045519_2220392851229682841_n.jpg?stp=c256.0.1536.1536a_dst-jpg_tt6&cstp=mx1536x1536&ctp=s206x206&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeESCpLX1hVCXUKeoBkcLNDQHg-Xh8eg27geD5eHx6DbuKo-WphJf4mKiIbg8UQJk47F3ML8D3uaRwcpGZbM5IG7&_nc_ohc=5lob2zr3H-YQ7kNvwFJUnwy&_nc_oc=AdqElpGRnN_7IWz7tZo5Os8UTVurgitkoguXsFGH63fn8oiFMcK2iqG462D9lUalaU4&_nc_zt=23&_nc_ht=scontent.fvte3-1.fna&_nc_gid=EkYQmXXmSDFgfBgNDPpK7A&_nc_ss=7b2a8&oh=00_AQRTP4eQEuRHaLobzjpsD6ikloL5x_9n7eWsv30HtqfHdg&oe=6AFF8442",
  },
  {
    title: "ກິດຈະກຳພາກເຊົ້າ • ຝຶກຊ້ອມແນະນຳໂຕເອງເປັນພາສາມົ້ງ ແລະ ພາສາລາວ",
    subtitle: "ณ ຫໍປະຊຸມ ສວນບັນດາເຜົ່າ / Lao Ethnic Garden",
    url: "https://scontent.fvte3-1.fna.fbcdn.net/v/t39.30808-6/905023609_1613467504144987_1842193971304976330_n.jpg?stp=c0.169.1536.1536a_dst-jpg_tt6&cstp=mx1536x1536&ctp=s206x206&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeFfDhpHgf9sWu2ayp91UqwD_vTRlX84Cgz-9NGVfzgKDJB_cS32aJCH-Ymc3DzqrXRJPiy4mpJJP2DhTMZt7rfN&_nc_ohc=Mu_epxiMzl4Q7kNvwEjW1xU&_nc_oc=AdoF39ePrkliQr7by8Iew5ynmP3NgEFq6iYTX8nJ71xMkUDRIZdFZTaCDIF5Nlu5hBQ&_nc_zt=23&_nc_ht=scontent.fvte3-1.fna&_nc_gid=HPlFtRJGsOM8f4cuGThZ9A&_nc_ss=7b2a8&oh=00_AQR9qmWsWmK6M9HpUlr7ao8BDtLKuFyp7AZbQsDjJnI6Zg&oe=6AFF9C43",
  },
  {
    title: "ການສະແດງຄວາມສາມາດ ແລະ ກ່າວທັກທາຍເທິງເວທີຫໍປະຊຸມ",
    subtitle: "ຜູ້ເຂົ້າປະກວດ Miss Hmong Vientiane 2027 ຝຶກຊ້ອມບຸກຄະລິກກະພາບ ແລະ ການຕອບຄຳຖາມ",
    url: "https://scontent.fvte1-1.fna.fbcdn.net/v/t39.30808-6/906110659_1613467467478324_7143124933969724244_n.jpg?stp=c0.169.1536.1536a_dst-jpg_tt6&cstp=mx1536x1536&ctp=s206x206&_nc_cat=102&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeExrPZHkBNwyircPRm--S4FVYKEiqzIbJ1VgoSKrMhsnSH_Yi2HWI2qMwMCEKgCyJFvHd5ZzEoTlrtnBbSOmJXx&_nc_ohc=VkDHbxvoaIQQ7kNvwHkUVIf&_nc_oc=Adrsm2eDIFw9IKg9Q3QPmZKZBYG5-nFtX54RqtLPwjwRMRqpgh9Eku-jvudZ3zhu-GM&_nc_zt=23&_nc_ht=scontent.fvte1-1.fna&_nc_gid=HPlFtRJGsOM8f4cuGThZ9A&_nc_ss=7b2a8&oh=00_AQRhvSshoFVL33uC4FAqrG7Ro4Z-aQKmzGEbyfEuNAho1w&oe=6AFFAEA2",
  },
  {
    title: "ກິດຈະກຳຟ້ອນສິລະປະ ແລະ ຮຽນຮູ້ວັດທະນະທຳບັນດາເຜົ່າ",
    subtitle: "ຮ່ວມສົ່ງແຮງໃຈເຊຍສາວງາມທັງ 20 ໝາຍເລກ ຜ່ານລະບົບໂຫວດອອນລາຍ ແລະ ເພຈ PHEUKSA",
    url: "https://scontent.fvte3-1.fna.fbcdn.net/v/t39.30808-6/907975686_1613467330811671_4492737995052604977_n.jpg?stp=c0.169.1536.1536a_dst-jpg_tt6&cstp=mx1536x1536&ctp=s206x206&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeG4rsC5oiE79-d1ylRe_YroR9mLYetI75NH2Yth60jvkwm89XFJ5MkZEJZ-4HGoP1f1-KZlZkKRuzClnQ7UI0ox&_nc_ohc=LZTKpvJpaxMQ7kNvwHRFf7l&_nc_oc=AdpqAvrNzwBkmVZijKogbuqSgTTIhbhnR7axVS1rSnXRP8fBQuODy3W_47uNOfuSQRw&_nc_zt=23&_nc_ht=scontent.fvte3-1.fna&_nc_gid=OJzgeZNeqepqVcmsCm-c8w&_nc_ss=7b2a8&oh=00_AQSxe9x8X-9FVvCmtrhEdCI0aTOscleUk9RzjY_wH1yEow&oe=6AFF9811",
  },
];

const INITIAL_COMMITTEE = [
  {
    order: 1,
    badge: "ປະທານສູງສຸດ • CHAIRMAN",
    name: "ປະທານ ພູວົງ ພະມີສິດ",
    role: "ປະທານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027",
    subRole: "ປະທານໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden) & ປະທານ ຮ້ານຄຳພູວົງ (Phouvong Jewelry)",
    quote:
      "ສົ່ງເສີມ ແລະ ອະນຸລັກວັດທະນະທຳຮີດຄອງປະເພນີອັນດີງາມຂອງແມ່ຍິງຊົນເຜົ່າມົ້ງ ພ້ອມຊິງຕຳແໜ່ງ ແລະ ເງິນລາງວັນລວມມູນຄ່າ 500 ກວ່າລ້ານກີບ",
    image: "/committee/img3.jpg",
    featured: true,
  },
  {
    order: 2,
    badge: "ຜູ້ອຳນວຍການ • DIRECTOR",
    name: "ທ່ານ ນາງ ຄຳຫລ້າ ລໍ່ເບຼຍຢາວ",
    role: "ຜູ້ອຳນວຍການກອງປະກວດ",
    subRole: "ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027",
    image: "/committee/img5.jpg",
    featured: false,
  },
  {
    order: 3,
    badge: "ຜູ້ຈັດການທົ່ວໄປ • GM",
    name: "ທ່ານ ນາງ ລັດສະໝີ ໄຊຍະວົງ",
    role: "ຜູ້ຈັດການທົ່ວໄປ",
    subRole: "ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden)",
    image: "/committee/img1.jpg",
    featured: false,
  },
  {
    order: 4,
    badge: "ຜູ້ບໍລິຫານ • EXECUTIVE",
    name: "ທ່ານ ບຸນມີ ບົວແກ້ວ",
    role: "ຜູ້ບໍລິຫານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ",
    subRole: "ຄະນະບໍລິຫານກອງປະກວດ Miss Hmong Vientiane 2027",
    image: "/committee/img2.jpg",
    featured: false,
  },
  {
    order: 5,
    badge: "ຜູ້ຈັດການກອງປະກວດ • MANAGER",
    name: "ທ່ານ ນາງ ຈິນດາ ວົງຄຳສິດ",
    role: "ຜູ້ຈັດການກອງປະກວດ",
    subRole: "ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027",
    image: "/committee/img4.jpg",
    featured: false,
  },
];

const CHEER_PRESETS = [
  "ສົ່ງແຮງໃຈເຊຍສຸດໃຈ!",
  "ຂໍໃຫ້ຄອງມົງກຸດເດີ້",
  "ໂຫວດສະໜັບສະໜູນເຕັມທີ່",
  "ງາມຫຼາຍ ສູ້ໆເດີ້!",
];

const TICKET_TIERS = [
  {
    id: "standard",
    name: "Standard Garden Pass",
    nameLao: "ບັດເຂົ້າຊົມທົ່ວໄປ (Standard Zone)",
    priceLak: 50000,
    bonusVotes: 2,
    Zone: "Zone C • ບ່ອນນັ່ງອັດສະຈັນ",
    perks: [
      "ບັດເຂົ້າຊົມງານຮອບຕັດສິນ 1 ທ່ານ",
      "ຮັບຟຣີຄະແນນໂຫວດ +2 Votes",
    ],
    badge: "ລາຄາປະຢັດ",
    iconType: "ticket",
  },
  {
    id: "gold",
    name: "Gold Cultural Zone",
    nameLao: "ບັດ Gold Zone (ກາງຮໍໃກ້ເວທີ)",
    priceLak: 150000,
    bonusVotes: 15,
    Zone: "Zone B • ກາງຮໍ",
    perks: [
      "ບ່ອນນັ່ງໂຊນ Gold ມຸມມອງຊັດເຈນ",
      "ຮັບຟຣີຄະແນນໂຫວດ +15 Votes ທັນທີ",
      "ຮັບເຄື່ອງດື່ມ Welcome Drink 1 ຊຸດ",
    ],
    badge: "ຍອດນິຍົມ",
    iconType: "flame",
    popular: true,
  },
  {
    id: "vip",
    name: "VIP Front Row",
    nameLao: "ບັດ VIP ແຖວໜ້າຕິດຂອບເວທີ",
    priceLak: 350000,
    bonusVotes: 40,
    Zone: "Zone A • VIP Front Row",
    perks: [
      "ບ່ອນນັ່ງ VIP ແຖວໜ້າສຸດໃກ້ຊິດສາວງາມ",
      "ຮັບຟຣີຄະແນນໂຫວດ +40 Votes",
      "ສິດຖ່າຍຮູບຮ່ວມກັບຜູ້ຊະນະຫຼັງຈົບງານ",
      "ຊຸດຂອງທີ່ລະລຶກ ສວນບັນດາເຜົ່າ Limited",
    ],
    badge: "VIP Pass",
    iconType: "crown",
  },
  {
    id: "vvip",
    name: "VVIP Royal Table (10 Seats)",
    nameLao: "ໂຕະ VVIP ກຽດຕິຍົດ (ສຳລັບ 10 ທ່ານ)",
    priceLak: 5000000,
    bonusVotes: 600,
    Zone: "Royal Zone • ໜ້າເວທີກາງ",
    perks: [
      "ໂຕະ VVIP ພິເສດໜ້າເວທີ ສຳລັບ 10 ທ່ານ",
      "ຮັບຟຣີຄະແນນໂຫວດສູງເຖິງ +600 Votes",
      "ອາຫານຄ່ຳ ແລະ ເຄື່ອງດື່ມລະດັບພຣີມຽມຄົບຊຸດ",
      "ຂຶ້ນຊື່ຜູ້ສະໜັບສະໜູນເທິງຈໍ LED ຫຼັກຂອງງານ",
    ],
    badge: "Royal VVIP",
    iconType: "trophy",
  },
];

const SCHEDULE_ITEMS = [
  {
    date: "17 ຕຸລາ 2026",
    time: "09:00 - 18:00",
    title: "ເປີດຮັບສະໝັກຢ່າງເປັນທາງການ ນາງສາວເຜົ່າມົ້ງ ນະຄອນຫຼວງວຽງຈັນ 2027 (ຊິງລາງວັນລວມ 500 ກວ່າລ້ານກີບ)",
    location: "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden • ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ",
    status: "ສຳເລັດແລ້ວ",
    done: true,
  },
  {
    date: "14 ພະຈິກ 2026",
    time: "08:30 - 17:30",
    title: "ມື້ເກັບໂຕ ມື້ທີ 1 • ຊ້ອມຍ່າງ, ຮຽນບຸກຄະລິກກະພາບ, ມາລະຍາດ, ການເວົ້າ, ການນົບ ແລະ ການໂພສຢູ່ເວທີ",
    location: "ຫໍປະຊຸມ ສວນບັນດາເຜົ່າ / Lao Ethnic Garden",
    status: "ສຳເລັດແລ້ວ",
    done: true,
  },
  {
    date: "15 ພະຈິກ 2026",
    time: "08:30 - 21:00",
    title: "ມື້ເກັບໂຕ ມື້ທີ 2 (ກຸ່ມທີ 1 - 4) & ເຜີຍໂສມ 20 ໝາຍເລກ (HM 01 - HM 20) ໃນຊຸດມົ້ງດັ້ງເດີມ",
    location: "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden • ຊ່າງພາບ: StarYang CU",
    status: "ກຳລັງເປີດໂຫວດ",
    live: true,
  },
  {
    date: "20 ພະຈິກ 2026",
    time: "18:30 - 22:00",
    title: "ຮອບເກັບຄະແນນ (Preliminary) • ແນະນຳໂຕເປັນພາສາມົ້ງ-ພາສາລາວ & ສະແດງຄວາມສາມາດພິເສດ",
    location: "ຫໍປະຊຸມໃຫຍ່ ສວນບັນດາເຜົ່າ / Lao Ethnic Garden",
    status: "ໄວໆນີ້",
    done: false,
  },
  {
    date: "25 ພະຈິກ 2026",
    time: "19:00 - 23:30",
    title: "ຮອບຕັດສິນຊິງມົງກຸດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 (Grand Finale Night)",
    location: "ເວທີຫຼັກ ສວນບັນດາເຜົ່າ (ມອບມົງກຸດໂດຍ ນ້ອງ ເກ້ຍເຮີ Miss Hmong Vientiane 2026)",
    status: "ຮອບຕັດສິນ",
    finale: true,
    done: false,
  },
];

const NEWS_ITEMS = [
  {
    id: 1,
    date: "15 ພະຈິກ 2026",
    category: "ຊິງລາງວັນລວມ 500 ກວ່າລ້ານກີບ",
    title: "ປະທານ ພູວົງ ພະມີສິດ ເປີດລະບົບໂຫວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 ຊິງຕຳແໜ່ງ ແລະ ລາງວັນລວມ 500 ກວ່າລ້ານກີບ!",
    excerpt:
      "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden (ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ) ແລະ ຮ້ານຄຳພູວົງ Phouvong Jewelry ເປີດໂອກາດໃຫ້ມວນຊົນຮ່ວມໂຫວດຂວັນໃຈມະຫາຊົນ & ຂວັນໃຈໂຊຊຽວມີເດຍ ຜ່ານ BCEL OnePay ແລະ APB Lao QR.",
    type: "chairman",
    images: ["/committee/img3.jpg"],
  },
  {
    id: 2,
    date: "15 ພະຈິກ 2026",
    category: "ກິດຈະກຳເກັບໂຕ & ຖ່າຍຮູບ",
    title: "ພາບບັນຍາກາດກິດຈະກຳເກັບໂຕ ມື້ທີ 1 & ມື້ທີ 2 ທີ່ ສວນບັນດາເຜົ່າ / Lao Ethnic Garden",
    excerpt:
      "ຊ້ອມຍ່າງ, ຮຽນບຸກຄະລິກກະພາບ, ມາລະຍາດ, ການເວົ້າ, ການນົບ, ການໂພສຢູ່ເວທີ ແລະ ຖ່າຍຮູບກຸ່ມ 1–4 • ຊ່າງພາບ: StarYang CU",
    content:
      "ນ້ອງໆຜູ້ເຂົ້າປະກວດ ນາງສາວເຜົ່າມົ້ງ ນະຄອນຫຼວງວຽງຈັນ Miss Hmong Vientiane 2027 ທັງ 20 ໝາຍເລກ (HM 01 - HM 20) ໄດ້ເຂົ້າຮ່ວມກິດຈະກຳເກັບໂຕຢ່າງເປັນທາງການ ມື້ທີ 1 ແລະ ມື້ທີ 2 ທີ່ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden), ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ ນະຄອນຫຼວງວຽງຈັນ.\n\nກິດຈະກຳສຳຄັນຕະຫຼອດ 2 ມື້:\n• ພາກເຊົ້າ: ຝຶກຊ້ອມທັກສະການແນະນຳຕົນເອງເປັນພາສາມົ້ງ ແລະ ພາສາລາວ, ການກ່າວທັກທາຍຕໍ່ໜ້າກ້ອງ ແລະ ເທິງເວທີຫໍປະຊຸມໃຫຍ່.\n• ພາກບ່າຍ: ທັດສະນະສຶກສາເຮືອນຊົນເຜົ່າດັ້ງເດີມ, ວັງພະຍານາກ, ແລະ ຍ່າງຊົມສວນໄຜ່ອັນຮົ່ມເຢັນ.\n• ການຝຶກອົບຮົມບຸກຄະລິກກະພາບ: ການຍ່າງ Catwalk, ມາລະຍາດການນົບ, ທ່າທາງການໂພສເທິງເວທີ.\n• ການສະແດງສິລະປະ-ວັດທະນະທຳ: ການຟ້ອນມົ້ງດັ້ງເດີມ ແລະ ຖ່າຍຮູບໝູ່ກຸ່ມ 1-4 ໂດຍຊ່າງພາບ StarYang CU.\n\nແຟນໆສາມາດຮ່ວມສົ່ງແຮງໃຈ ແລະ ໂຫວດຄະແນນຂວັນໃຈມະຫາຊົນໃຫ້ແກ່ນ້ອງໆສາວງາມທີ່ທ່ານຊື່ນຊອບໄດ້ທຸກວັນຕະຫຼອດ 24 ຊົ່ວໂມງ!",
    type: "gallery",
    images: [
      "/activities/act1.jpg",
      "/activities/act2.jpg",
      "/activities/act3.jpg",
      "/activities/act4.jpg",
      "/activities/act5.jpg",
      "/activities/act6.jpg",
    ],
  },
  {
    id: 3,
    date: "14 ພະຈິກ 2026",
    category: "ຝຶກຊ້ອມເທິງເວທີ",
    title: "ກິດຈະກຳເທິງເວທີຫໍປະຊຸມ • ຝຶກຊ້ອມການເວົ້າ, ບຸກຄະລິກກະພາບ ແລະ ການສະແດງສິລະປະ",
    excerpt:
      "ຜູ້ເຂົ້າປະກວດ Miss Hmong Vientiane 2027 ຝຶກຊ້ອມບຸກຄະລິກກະພາບ, ການນົບ ແລະ ການກ່າວທັກທາຍເທິງເວທີຫໍປະຊຸມ ສວນບັນດາເຜົ່າ",
    content:
      "ບັນຍາກາດການຝຶກຊ້ອມເທິງເວທີຫໍປະຊຸມໃຫຍ່ ສວນບັນດາເຜົ່າ ນ້ອງໆສາວງາມທັງ 20 ທ່ານ ໄດ້ສະແດງໄຫວພິບ ແລະ ຄວາມສາມາດຢ່າງໂດດເດັ່ນ ທັງການເວົ້າພາສາມົ້ງ ແລະ ພາສາລາວ ພ້ອມທັງຝຶກຊ້ອມທ່າຟ້ອນສິລະປະມົ້ງອັນອ່ອນຊ້ອຍ.",
    type: "gallery",
    images: [
      "/activities/act4.jpg",
      "/activities/act5.jpg",
      "/activities/act6.jpg",
    ],
  },
  {
    id: 4,
    date: "15 ພະຈິກ 2026",
    category: "ຄະນະບໍລິຫານ",
    title: "ຄະນະຜູ້ບໍລິຫານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 ຖ່າຍຮູບຮ່ວມກັນຢ່າງພ້ອມພຽງ",
    excerpt:
      "ທ່ານ ນາງ ຄຳຫລ້າ ລໍ່ເບຼຍຢາວ, ທ່ານ ນາງ ລັດສະໝີ ໄຊຍະວົງ, ທ່ານ ບຸນມີ ບົວແກ້ວ ແລະ ທ່ານ ນາງ ຈິນດາ ວົງຄຳສິດ ຮ່ວມປະຊຸມກຳນົດເກນຕັດສິນ.",
    type: "committee",
    images: [
      "/committee/img5.jpg",
      "/committee/img1.jpg",
      "/committee/img2.jpg",
      "/committee/img4.jpg",
    ],
  },
  {
    id: 5,
    date: "15 ພະຈິກ 2026",
    category: "ໂປຣໄຟລ໌ສາວງາມ",
    title: "ເຜີຍໂສມຜູ້ເຂົ້າປະກວດຄົບທັງ 20 ໝາຍເລກ (HM 01 - HM 20) ໃນຊຸດມົ້ງດັ້ງເດີມ ແລະ ເຄື່ອງປະດັບ ຮ້ານຄຳພູວົງ",
    excerpt:
      "ຮ່ວມເຊຍ ແລະ ໂຫວດລາງວັນຂວັນໃຈໂຊຊຽວມີເດຍ (1 Like = 1 ຄະແນນ, 1 Share = 1 ຄະແນນ) ແລະ ໂຫວດອອນລາຍຜ່ານ QR Code • ຊ່າງພາບທາງການ: StarYang CU.",
    type: "contestants",
    images: [
      "/contestants/hm01.jpg",
      "/contestants/hm12.jpg",
      "/contestants/hm16.jpg",
    ],
  },
];

const SPONSORS = [
  {
    tier: "ຜູ້ສະໜັບສະໜູນຫຼັກຢ່າງເປັນທາງການ (Title & Official Partners)",
    items: [
      {
        name: "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden (PHEUKSA)",
        role: "Official Host & Cultural Venue (ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ)",
      },
      {
        name: "ຮ້ານຄຳພູວົງ Phouvong Jewelry (KPV Group)",
        role: "Official Jewelry & 500,000,000+ LAK Prize Sponsor",
      },
      {
        name: "StarYang CU • Official Pageant Photographer",
        role: "ຊ່າງພາບທາງການ ກອງປະກວດ Miss Hmong Vientiane 2027",
      },
      {
        name: "BCEL OnePay & ລະບົບຊຳລະເງິນແຫ່ງຊາດ LAPNet / APB",
        role: "Official Real-Time QR Voting Partner",
      },
    ],
  },
];

function stripEmojis(text = "") {
  return String(text)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .trim();
}

export function hasJewelryPhoto(c) {
  if (!c) return false;
  return Boolean(
    c.image_url &&
    c.image_url.startsWith("/contestants/hm") &&
    !c.image_url.includes("traditional") &&
    c.code !== "HM 01"
  );
}

export default function HomePage() {
  const [contestants, setContestants] = useState(OFFICIAL_CONTESTANTS);
  const [pastQueens, setPastQueens] = useState([]);
  const [packages, setPackages] = useState(EIGHT_PACKAGES);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  const [lang, setLang] = useState("LA");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState("LAK");
  const [paymentMethod, setPaymentMethod] = useState("BCEL");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("ALL");
  const [sortBy, setSortBy] = useState("VOTES");
  const [costumeMode, setCostumeMode] = useState("TRADITIONAL");
  const [detailCostume, setDetailCostume] = useState("TRADITIONAL");

  const [votingContestant, setVotingContestant] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [cheerMessage, setCheerMessage] = useState(CHEER_PRESETS[0]);
  const [paymentRef, setPaymentRef] = useState("");
  const [submittingVote, setSubmittingVote] = useState(false);
  const [voteReceipt, setVoteReceipt] = useState(null);
  const [voteStep, setVoteStep] = useState(1);
  const [slipPreview, setSlipPreview] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);

  const [detailContestant, setDetailContestant] = useState(null);
  const [committeeList, setCommitteeList] = useState(INITIAL_COMMITTEE);
  const [ticketList, setTicketList] = useState(TICKET_TIERS);
  const [scheduleList, setScheduleList] = useState(SCHEDULE_ITEMS);
  const [newsList, setNewsList] = useState(NEWS_ITEMS);
  const [selectedNewsDetail, setSelectedNewsDetail] = useState(null);
  const [activeNewsImageIndex, setActiveNewsImageIndex] = useState(0);
  const [newsFilterCategory, setNewsFilterCategory] = useState("ALL");
  const newsSliderRef = React.useRef(null);
  const [canScrollNewsLeft, setCanScrollNewsLeft] = useState(false);
  const [canScrollNewsRight, setCanScrollNewsRight] = useState(true);

  const filteredNewsList = useMemo(() => {
    if (newsFilterCategory === "CAMP") {
      return newsList.filter(
        (n) =>
          n.type === "gallery" ||
          n.category?.includes("ເກັບໂຕ") ||
          n.category?.includes("ກິດຈະກຳ") ||
          n.title?.includes("ເກັບໂຕ")
      );
    }
    if (newsFilterCategory === "OFFICIAL") {
      return newsList.filter(
        (n) =>
          n.type !== "gallery" &&
          !n.category?.includes("ເກັບໂຕ") &&
          !n.title?.includes("ເກັບໂຕ")
      );
    }
    return newsList;
  }, [newsList, newsFilterCategory]);

  const scrollNews = (direction) => {
    if (newsSliderRef.current) {
      const container = newsSliderRef.current;
      const cardWidth = container.offsetWidth > 1024 ? container.offsetWidth / 3 : container.offsetWidth > 640 ? container.offsetWidth / 2 : container.offsetWidth * 0.85;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleNewsScroll = () => {
    if (newsSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = newsSliderRef.current;
      setCanScrollNewsLeft(scrollLeft > 15);
      setCanScrollNewsRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  const [isNewsHovered, setIsNewsHovered] = useState(false);
  const [isAutoPlayNews, setIsAutoPlayNews] = useState(true);

  // Auto-play news slider every 3.8 seconds
  useEffect(() => {
    if (!isAutoPlayNews || isNewsHovered || selectedNewsDetail) return;

    const interval = setInterval(() => {
      if (newsSliderRef.current) {
        const container = newsSliderRef.current;
        const cardWidth =
          container.offsetWidth > 1024
            ? container.offsetWidth / 3
            : container.offsetWidth > 640
            ? container.offsetWidth / 2
            : container.offsetWidth * 0.85;

        // If reached or near the end, loop smoothly back to beginning
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 25) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoPlayNews, isNewsHovered, selectedNewsDetail, filteredNewsList]);
  const [sponsorsRaw, setSponsorsRaw] = useState([]);
  const [bookingTicket, setBookingTicket] = useState(null);
  const [ticketBuyerName, setTicketBuyerName] = useState("");
  const [ticketBuyerPhone, setTicketBuyerPhone] = useState("");
  const [ticketQty, setTicketQty] = useState(1);
  const [ticketBookedSuccess, setTicketBookedSuccess] = useState(false);

  const [heartPopId, setHeartPopId] = useState(null);
  const [countdown, setCountdown] = useState({ days: 9, hrs: 14, mins: 28, secs: 45 });
  const [copiedShare, setCopiedShare] = useState(false);

  const formatPrice = (lak) => {
    if (currency === "THB") {
      return `฿${Math.round(lak / 650).toLocaleString()}`;
    }
    if (currency === "USD") {
      return `$${(lak / 22000).toFixed(1)}`;
    }
    return `${lak.toLocaleString()} ₭`;
  };

  const fetchState = async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.contestants) && data.contestants.length > 0) {
        setContestants(data.contestants);
      }
      if (Array.isArray(data.packages) && data.packages.length > 0) {
        setPackages(data.packages);
      }
      if (data.transactions) {
        setTransactions(data.transactions || []);
      }
      setSettings(data.settings || {});
      setTotalVotes(data.stats?.total_votes || 0);
      if (data.committee && data.committee.length > 0) {
          setCommitteeList(data.committee);
        }
        if (data.tickets && data.tickets.length > 0) {
          setTicketList(
            data.tickets.map((t) => ({
              ...t,
              id: t.tier_id || String(t.id),
              perks:
                typeof t.perks_json === "string"
                  ? JSON.parse(t.perks_json || "[]")
                  : t.perks || [],
            }))
          );
        }
        if (data.schedule && data.schedule.length > 0) {
          setScheduleList(data.schedule);
        }
        if (data.news && data.news.length > 0) {
          setNewsList(
            data.news.map((n) => ({
              ...n,
              images:
                typeof n.images_json === "string"
                  ? JSON.parse(n.images_json || "[]")
                  : n.images || [],
            }))
          );
        }
        if (data.sponsors && data.sponsors.length > 0) {
          setSponsorsRaw(data.sponsors);
        }
    } catch (err) {
      console.error("Failed to load voting state:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatLaoCountdownDate = (dateStr) => {
    if (!dateStr) return "25 ພະຈິກ 2026";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const months = [
        "ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມິຖຸນາ",
        "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ"
      ];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    fetchState();
    const timer = setInterval(fetchState, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const targetStr = settings.countdown_date || "2026-11-25T18:00:00";
      const targetTime = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, targetTime - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hrs, mins, secs });
    };
    updateCountdown();
    const tick = setInterval(updateCountdown, 1000);
    return () => clearInterval(tick);
  }, [settings.countdown_date]);

  const activeContestants = useMemo(
    () => contestants.filter((c) => c.is_active === 1),
    [contestants]
  );

  const rankedContestants = useMemo(() => {
    const sorted = [...activeContestants].sort(
      (a, b) => b.total_votes - a.total_votes || a.code.localeCompare(b.code)
    );
    return sorted.map((c, index) => {
      const rank = index + 1;
      const aboveContestant = index > 0 ? sorted[index - 1] : null;
      const pointsToOvertake = aboveContestant
        ? Math.max(1, aboveContestant.total_votes - c.total_votes + 1)
        : 0;
      return {
        ...c,
        rank,
        aboveCode: aboveContestant?.code || null,
        pointsToOvertake,
      };
    });
  }, [activeContestants]);

  const provinces = useMemo(() => {
    const set = new Set();
    activeContestants.forEach((c) => set.add(c.province));
    return ["ALL", ...Array.from(set)];
  }, [activeContestants]);

  const filteredContestants = useMemo(() => {
    const list = rankedContestants.filter((c) => {
      const matchesProvince =
        selectedProvince === "ALL" || c.province === selectedProvince;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.nickname.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q) ||
        (c.ethnic_group || "").toLowerCase().includes(q);

      // In JEWELRY mode: if no specific search query, only show contestants with real Phouvong jewelry photos
      if (costumeMode === "JEWELRY" && !q) {
        return matchesProvince && matchesSearch && hasJewelryPhoto(c);
      }

      return matchesProvince && matchesSearch;
    });

    if (sortBy === "CODE") {
      return [...list].sort((a, b) => a.code.localeCompare(b.code));
    }
    if (sortBy === "HEARTS") {
      return [...list].sort((a, b) => (b.hearts || 0) - (a.hearts || 0));
    }
    return list;
  }, [rankedContestants, selectedProvince, searchQuery, sortBy, costumeMode]);

  const topThree = useMemo(() => rankedContestants.slice(0, 3), [rankedContestants]);
  const topFive = useMemo(() => rankedContestants.slice(0, 5), [rankedContestants]);

  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroAutoPlay, setHeroAutoPlay] = useState(true);

  const carouselContestants = useMemo(() => {
    return [...rankedContestants].sort((a, b) => a.code.localeCompare(b.code));
  }, [rankedContestants]);

  const heroTotalPages = Math.ceil(carouselContestants.length / 2) || 1;

  useEffect(() => {
    if (!heroAutoPlay || heroTotalPages <= 1) return;
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroTotalPages);
    }, 3800);
    return () => clearInterval(interval);
  }, [heroAutoPlay, heroTotalPages]);

  const heroCurrentItems = useMemo(() => {
    if (carouselContestants.length === 0) return [];
    const start = heroSlideIndex * 2;
    return carouselContestants.slice(start, start + 2);
  }, [carouselContestants, heroSlideIndex]);

  const openVoteModal = (c, presetPkg = null) => {
    setVotingContestant(c);
    setVoteReceipt(null);
    setVoteStep(presetPkg ? 2 : 1);
    setSlipPreview(null);
    setCopiedBank(false);
    setPaymentRef(
      `${paymentMethod}-${Math.floor(100000 + Math.random() * 900000)}`
    );
    if (presetPkg) {
      setSelectedPkg(presetPkg);
    } else if (packages.length > 0 && !selectedPkg) {
      setSelectedPkg(packages[2] || packages[1] || packages[0]);
    }
  };

  const handleCopyBank = (accNum) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(accNum);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleSlipUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ (PNG, JPG, JPEG)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const MAX_SIZE = 1280;
          let w = img.width;
          let h = img.height;
          if (w > MAX_SIZE || h > MAX_SIZE) {
            if (w > h) {
              h = Math.round((h * MAX_SIZE) / w);
              w = MAX_SIZE;
            } else {
              w = Math.round((w * MAX_SIZE) / h);
              h = MAX_SIZE;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setSlipPreview(compressed);
        } catch {
          setSlipPreview(loadEvt.target?.result);
        }
      };
      img.onerror = () => {
        setSlipPreview(loadEvt.target?.result);
      };
      img.src = loadEvt.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSendHeart = async (e, c) => {
    e.stopPropagation();
    setHeartPopId(c.id);
    setTimeout(() => setHeartPopId(null), 650);
    setContestants((prev) =>
      prev.map((item) =>
        item.id === c.id ? { ...item, hearts: (item.hearts ?? 0) + 1 } : item
      )
    );
    try {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "HEART", contestant_id: c.id }),
      });
    } catch {}
  };

  const handleVoteSubmit = async () => {
    if (!votingContestant || !selectedPkg) return;
    setSubmittingVote(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contestant_id: votingContestant.id,
          package_id: selectedPkg.id,
          voter_name: voterName,
          voter_phone: voterPhone,
          cheer_message: cheerMessage,
          payment_ref: paymentRef,
          slip_image_url: slipPreview,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "ເກີດຂໍ້ຜິດພາດ");
      } else {
        setVoteReceipt(data.transaction);
        await fetchState();
      }
    } catch {
      alert("ບໍ່ສາມາດເຊື່ອມຕໍ່ Server ໄດ້");
    } finally {
      setSubmittingVote(false);
    }
  };

  const handleCopyShare = (text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const votingOpen = settings.voting_open !== "false";
  const latestApprovedTx =
    transactions.find((t) => t.status === "APPROVED") || transactions[0];
  const gapFirstSecond =
    topThree.length >= 2
      ? Math.max(1, topThree[0].total_votes - topThree[1].total_votes)
      : 0;

  const navLinks = [
    { href: "#home", label: lang === "LA" ? "ໜ້າຫຼັກ" : "Home", icon: Home },
    { href: "#leaderboard", label: lang === "LA" ? "ອັນດັບໂຫວດ" : "Leaderboard", icon: Trophy },
    { href: "#contestants", label: lang === "LA" ? "ຜູ້ເຂົ້າປະກວດ" : "Contestants", icon: Crown },
    { href: "#past-queens", label: lang === "LA" ? "ອະດີດນາງສາວ" : "Hall of Fame", icon: Award },
    { href: "#committee", label: lang === "LA" ? "ຄະນະກຳມະການ" : "Committee", icon: Users },
    { href: "#tickets", label: lang === "LA" ? "ປີ້ເຂົ້າຊົມ" : "Tickets", icon: Ticket },
    { href: "#schedule", label: lang === "LA" ? "ຕາຕະລາງ" : "Schedule", icon: Calendar },
    { href: "#news", label: lang === "LA" ? "ຂ່າວສານ" : "News", icon: Newspaper },
    { href: "#sponsors", label: lang === "LA" ? "ຜູ້ສະໜັບສະໜູນ" : "Sponsors", icon: Handshake },
    { href: "#about", label: lang === "LA" ? "ກ່ຽວກັບ" : "About", icon: BookOpen },
  ];

  const chairman =
    committeeList.find((c) => c.featured) || committeeList[0] || INITIAL_COMMITTEE[0];
  const directors = committeeList.filter((c) => c.id !== chairman?.id);

  const formattedSponsors = useMemo(() => {
    if (!sponsorsRaw || sponsorsRaw.length === 0) return SPONSORS;
    const tiersOrder = ["DIAMOND", "PLATINUM", "GOLD"];
    const tierMeta = {
      DIAMOND: { tier: "DIAMOND SPONSORS", color: "from-amber-300 via-amber-400 to-amber-600" },
      PLATINUM: { tier: "PLATINUM SPONSORS", color: "from-slate-200 via-slate-300 to-slate-400" },
      GOLD: { tier: "GOLD SPONSORS", color: "from-amber-200 to-amber-400" },
    };
    return tiersOrder
      .map((t) => {
        const items = sponsorsRaw.filter((s) => s.tier === t);
        return {
          tier: tierMeta[t]?.tier || `${t} SPONSORS`,
          color: tierMeta[t]?.color || "from-amber-300 to-amber-500",
          items: items.map((i) => ({ name: i.name, role: i.role })),
        };
      })
      .filter((g) => g.items.length > 0);
  }, [sponsorsRaw]);

  return (
    <div id="home" className="min-h-screen flex flex-col bg-[#f8f4fc] text-[#240638]">
      {/* Top Live Ticker Bar */}
      {latestApprovedTx && (
        <div className="bg-[#26053b] text-white py-2 px-4 text-xs border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c084fc] text-[#1f0330] font-black text-[11px] shrink-0">
                LIVE VOTE
              </span>
              <span className="text-white/95 truncate">
                <strong className="text-amber-300">{latestApprovedTx.voter_name}</strong>{" "}
                ຫາກໍ່ໂຫວດ{" "}
                <strong className="text-[#f5d0fe]">
                  +{latestApprovedTx.points_added.toLocaleString()} Votes
                </strong>{" "}
                ໃຫ້ໝາຍເລກ{" "}
                <strong className="text-white underline decoration-[#c084fc]">
                  {latestApprovedTx.contestant_code} ({latestApprovedTx.contestant_name})
                </strong>
                {latestApprovedTx.cheer_message
                  ? ` — “${stripEmojis(latestApprovedTx.cheer_message)}”`
                  : ""}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:inline-flex items-center rounded-lg bg-white/10 p-0.5 text-[10px]">
                {["LAK", "THB", "USD"].map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                      currency === cur
                        ? "bg-[#c084fc] text-[#1f0330]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>

              <a
                href="#contestants"
                className="text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1"
              >
                <span>ໂຫວດຕອນນີ້ເລີຍ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Full Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#9333ea]/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
          <a href="#home" className="flex items-center gap-2.5 shrink-0">
            <div className="h-12 px-2.5 py-1 rounded-xl shadow-xs border border-amber-400/40 bg-[#240638] flex items-center shrink-0">
              <img
                src="/logo_mhvt.png"
                alt="MHVT Miss Hmong Vientiane 2027"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block lg:hidden 2xl:block whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[#240638] tracking-normal">
                  ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    votingOpen
                      ? "bg-[#a855f7]/15 text-[#6b1699]"
                      : "bg-rose-500/15 text-rose-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      votingOpen ? "bg-[#6b1699] animate-pulse" : "bg-rose-600"
                    }`}
                  />
                  <span>{votingOpen ? "LIVE" : "CLOSED"}</span>
                </span>
              </div>
              <p className="text-[10px] text-[#644180] font-semibold">
                ຮ້ານຄຳພູວົງ • MHVT • ສວນບັນດາເຜົ່າ
              </p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-black text-[#380957] whitespace-nowrap">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-xl hover:bg-[#f3ebfa] hover:text-[#7e1db3] transition whitespace-nowrap shrink-0"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <button
              type="button"
              onClick={() => setLang(lang === "LA" ? "EN" : "LA")}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#f8f4fc] hover:bg-[#e9d5ff] border border-[#9333ea]/25 text-xs font-extrabold text-[#380957] whitespace-nowrap shrink-0 cursor-pointer"
              title="ປ່ຽນພາສາ LA / EN"
            >
              <Globe className="w-3.5 h-3.5 text-[#7e1db3] shrink-0" />
              <span>{lang === "LA" ? "LA" : "EN"}</span>
            </button>

            <a
              href="#contestants"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-xs font-black btn-garden-vote whitespace-nowrap shrink-0"
            >
              <span>{lang === "LA" ? "ໂຫວດເລີຍ" : "Vote Now"}</span>
            </a>

            <Link
              href="/admin"
              className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-[#f3ebfa] hover:bg-[#e9d5ff] text-[#380957] border border-[#9333ea]/30 transition whitespace-nowrap shrink-0"
            >
              <span className="hidden md:inline">Admin</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#f3ebfa] text-[#380957] border border-[#9333ea]/30 shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#9333ea]/20 px-4 py-4 space-y-2 shadow-lg">
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-[#f8f4fc] hover:bg-[#a855f7]/25 text-xs font-black text-[#2d0747] text-center whitespace-nowrap"
                >
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO BANNER (CLEAN, UNCLUTTERED ROYAL PURPLE & GOLD) */}
      <section className="relative overflow-hidden garden-luxury-dark text-white py-12 sm:py-16 border-b border-amber-400/30">
        {/* Soft Ambient Glows Only (No Cluttered Lines) */}
        <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#a855f7]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Clean Typography & Actions */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* 3 Official Pageant Logos Banner (Phouvong Jewelry • MHVT 2027 • Lao Ethnic Garden) */}
              <div className="inline-block max-w-md sm:max-w-lg rounded-2xl overflow-hidden border border-amber-400/50 bg-[#240638]/90 p-1.5 shadow-2xl backdrop-blur-md">
                <img
                  src="/official_pageant_logos.jpg"
                  alt="3 ໂລໂກ້ຫຼັກຂອງກອງປະກວດ: ຮ້ານຄຳພູວົງ Phouvong Jewelry • MHVT 2027 • ສວນບັນດາເຜົ່າ Lao Ethnic Garden"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>

              {/* Clean Main Title (No Messy Underlines Cutting Vowels) */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black tracking-normal text-white leading-snug">
                  ກອງປະກວດ{" "}
                  <span className="text-amber-300">
                    ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027
                  </span>
                </h1>

                <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  ຊິງຕຳແໜ່ງ ແລະ ເງິນລາງວັນລວມມູນຄ່າ{" "}
                  <strong className="text-amber-300">500 ກວ່າລ້ານກີບ</strong> •
                  ຮ່ວມໂຫວດຂວັນໃຈມະຫາຊົນໃຫ້ສາວງາມທັງ{" "}
                  <strong className="text-white">20 ໝາຍເລກ (HM 01 - HM 20)</strong>
                </p>
              </div>

              {/* Clean CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <a
                  href="#contestants"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm sm:text-base btn-gold-vote flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>ໂຫວດໃຫ້ຜູ້ເຂົ້າປະກວດເລີຍ</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#leaderboard"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-sm bg-white/10 hover:bg-white/20 border border-white/25 text-white flex items-center justify-center gap-2 transition"
                >
                  <span>ເບິ່ງ 5 ອັນດັບຄະແນນສູງສຸດ</span>
                </a>
              </div>

              {/* Clean Minimal Countdown */}
              <div className="pt-1">
                <div className="text-[11px] font-bold text-amber-200/90 mb-2">
                  {settings.countdown_label || "ນັບຖອຍຫຼັງສູ່ຮອບຕັດສິນ"} ({formatLaoCountdownDate(settings.countdown_date)})
                </div>
                <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto lg:mx-0">
                  {[
                    { val: countdown.days, unit: "ມື້" },
                    { val: countdown.hrs, unit: "ຊົ່ວໂມງ" },
                    { val: countdown.mins, unit: "ນາທີ" },
                    { val: countdown.secs, unit: "ວິນາທີ" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-white/10 border border-white/15 py-2 px-2 text-center"
                    >
                      <div className="font-black text-lg sm:text-xl text-amber-300">
                        {String(item.val).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] text-white/75 font-medium">
                        {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Auto-Sliding Contestants Carousel (HM 01 - HM 20) */}
            <div className="lg:col-span-5">
              {heroCurrentItems.length > 0 && (
                <div
                  onMouseEnter={() => setHeroAutoPlay(false)}
                  onMouseLeave={() => setHeroAutoPlay(true)}
                  className="rounded-3xl bg-white/10 backdrop-blur-md border border-amber-400/35 p-5 shadow-2xl space-y-4"
                >
                  {/* Slider Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-black text-white">
                      ເຜີຍໂສມສາວງາມ 20 ໝາຍເລກ
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[11px] font-extrabold">
                        {heroCurrentItems.map((c) => c.code).join(" & ")}
                      </span>
                      {/* Prev & Next Navigation Arrows */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setHeroSlideIndex(
                              (prev) => (prev - 1 + heroTotalPages) % heroTotalPages
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
                          title="ກ່ອນໜ້າ"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setHeroSlideIndex((prev) => (prev + 1) % heroTotalPages)
                          }
                          className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
                          title="ຖັດໄປ"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2 Side-by-Side Sliding Contestant Cards */}
                  <div className="grid grid-cols-2 gap-3.5">
                    {heroCurrentItems.map((item, idx) => {
                      const hasJewelry = hasJewelryPhoto(item);
                      const isJewelry = costumeMode === "JEWELRY" && hasJewelry;
                      const displayImg = isJewelry
                        ? item.image_url
                        : (item.traditional_image_url || item.image_url);

                      return (
                        <div
                          key={item.id || item.code || idx}
                          onClick={() => openVoteModal(item)}
                          className="group rounded-2xl overflow-hidden border-2 border-amber-400/70 bg-[#240438] hover:border-amber-300 cursor-pointer transition duration-300 hover:-translate-y-1 flex flex-col shadow-lg"
                        >
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#35064f]">
                            <img
                              src={displayImg}
                              alt={item.name}
                              onError={(e) => {
                                e.currentTarget.src = `/api/avatar?code=${item.code}&bg=gold&name=${encodeURIComponent(item.nickname)}`;
                              }}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow bg-gradient-to-r from-amber-300 to-amber-500 text-[#240638]">
                              {item.code}
                            </span>
                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black shadow bg-black/75 text-amber-300 border border-amber-400/30">
                              {isJewelry ? "ຊຸດປະດັບຄຳ" : "ຊຸດມົ້ງດັ້ງເດີມ"}
                            </span>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-amber-300 font-black text-[11px] border border-amber-400/40">
                              ອັນດັບ #{item.rank}
                            </span>
                          </div>

                          <div className="p-3 text-center bg-gradient-to-b from-[#2e0647] to-[#1c032e]">
                            <div className="font-black text-xs sm:text-sm text-white truncate group-hover:text-amber-200 transition">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-[#f5d0fe]/80 truncate mt-0.5">
                              {item.province}
                            </div>
                            <div className="text-sm font-black text-amber-300 mt-1">
                              {item.total_votes.toLocaleString()} Votes
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Slider Progress Dots & Play State */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Array.from({ length: heroTotalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setHeroSlideIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            heroSlideIndex === idx
                              ? "w-5 bg-amber-400"
                              : "w-1.5 bg-white/30 hover:bg-white/50"
                          }`}
                          title={`ໝາຍເລກຊຸດທີ ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-amber-200/70 font-semibold">
                      {heroAutoPlay ? "ສະໄລ້ອັດຕະໂນມັດ..." : "ກຳລັງເບິ່ງ"}
                    </span>
                  </div>

                  {/* Dual Quick Vote Buttons for the 2 Current Contestants */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    {heroCurrentItems.map((item, idx) => (
                      <button
                        key={item.id || item.code || idx}
                        type="button"
                        onClick={() => openVoteModal(item)}
                        className="py-2.5 px-2 rounded-xl btn-gold-vote font-black text-xs flex items-center justify-center cursor-pointer truncate shadow"
                      >
                        <span className="truncate">ໂຫວດ {item.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: EXECUTIVE COMMITTEE (ຄະນະປະທານ ແລະ ຄະນະບໍລິຫານກອງປະກວດ 5 ທ່ານ) */}
      <section id="committee" className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 w-full">
        <div className="rounded-[40px] garden-luxury-dark border-2 border-amber-400/50 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden text-white">
          {/* Decorative Royal Gold & Purple Spotlights */}
          <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[680px] h-[320px] rounded-full bg-gradient-to-b from-amber-400/25 via-[#a855f7]/20 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#c084fc]/20 blur-3xl" />

          {/* Grand Royal Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-10 relative z-10 space-y-3">
            <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#240638] text-xs font-black uppercase tracking-wider shadow-lg">
              <span>OFFICIAL EXECUTIVE BOARD • ຄະນະປະທານ ແລະ ຄະນະບໍລິຫານກອງປະກວດ</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-normal leading-tight drop-shadow">
              ຄະນະປະທານ ແລະ ຜູ້ບໍລິຫານ{" "}
              <span className="text-amber-300 underline decoration-amber-400/60">
                ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-[#f5d0fe] max-w-2xl mx-auto">
              ພາຍໃຕ້ການນຳພາ ແລະ ສະໜັບສະໜູນຫຼັກໂດຍ{" "}
              <strong className="text-amber-300">ຮ້ານຄຳພູວົງ (Phouvong Jewelry)</strong> ແລະ{" "}
              <strong className="text-amber-300">ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden)</strong>
            </p>

            {/* 3 Official Pageant Main Logos */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              <div className="h-13 sm:h-14 px-3.5 py-1.5 rounded-2xl bg-white/10 border border-amber-400/40 backdrop-blur-md flex items-center shadow-lg hover:border-amber-300 transition">
                <img
                  src="/logo_phouvong.png"
                  alt="ຮ້ານຄຳພູວົງ Phouvong Jewelry"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
              <div className="h-13 sm:h-14 px-3.5 py-1.5 rounded-2xl bg-white/10 border border-amber-400/40 backdrop-blur-md flex items-center shadow-lg hover:border-amber-300 transition">
                <img
                  src="/logo_mhvt.png"
                  alt="MHVT Miss Hmong Vientiane 2027"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
              <div className="h-13 sm:h-14 px-3.5 py-1.5 rounded-2xl bg-white/10 border border-amber-400/40 backdrop-blur-md flex items-center shadow-lg hover:border-amber-300 transition">
                <img
                  src="/logo_lao_ethnic_garden.png"
                  alt="ສວນບັນດາເຜົ່າ Lao Ethnic Garden"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* TOP SPOTLIGHT: #1 Chairman Phouvong Phamisith */}
          <div className="max-w-4xl mx-auto mb-10 relative z-10">
            <div className="rounded-[36px] p-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.45)]">
              <div className="rounded-[32px] bg-gradient-to-br from-[#3b075e] via-[#26053d] to-[#150224] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative overflow-hidden">
                <div className="pointer-events-none absolute -right-12 -top-12 w-56 h-56 rounded-full bg-amber-400/15 blur-2xl" />

                {/* Left: Large Gold-Framed Portrait */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="w-56 h-68 sm:w-64 sm:h-76 rounded-[28px] overflow-hidden border-4 border-amber-400 shadow-2xl bg-[#240638]">
                    <img
                      src={chairman.image}
                      alt={chairman.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>

                {/* Right: Royal Credentials & Quote */}
                <div className="md:col-span-7 text-center md:text-left space-y-3.5">
                  <div className="inline-flex items-center px-3.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <span>{chairman.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-black text-amber-300 tracking-normal leading-snug">
                    {chairman.name}
                  </h3>

                  <div className="space-y-1">
                    <div className="text-base sm:text-lg font-black text-white">
                      {chairman.role}
                    </div>
                    <div className="text-xs sm:text-sm text-[#f5d0fe] font-semibold">
                      {chairman.sub_role || chairman.subRole}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 border border-amber-300/30 text-xs sm:text-sm text-amber-100 leading-relaxed italic">
                    &ldquo;{chairman.quote}&rdquo;
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-amber-400 text-[#240638] text-xs font-black shadow">
                      <span>ສະໜັບສະໜູນລາງວັນລວມ 500+ ລ້ານກີບ</span>
                    </span>
                    <a
                      href="#contestants"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-extrabold transition"
                    >
                      <span>ເບິ່ງຜູ້ເຂົ້າປະກວດທັງ 20 ໝາຍເລກ</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECOND ROW: #2, #3, #4, #5 Executive Directors & Managers (Full-Bleed Royal Portrait Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {directors.map((person, idx) => (
              <div
                key={person.id || person.order_no || person.order || idx}
                className="group rounded-[30px] p-[2px] bg-gradient-to-b from-amber-300 via-[#c084fc] to-amber-500/80 shadow-2xl hover:-translate-y-2 transition duration-300"
              >
                <div className="rounded-[28px] bg-gradient-to-b from-[#2e0647] to-[#190229] h-full overflow-hidden flex flex-col justify-between">
                  {/* Large Full-Bleed Portrait */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#240638]">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#190229] via-[#190229]/50 to-transparent" />
                  </div>

                  {/* Royal Gold & Purple Nameplate */}
                  <div className="p-5 text-center space-y-2 bg-gradient-to-b from-[#2b0542] to-[#160224] flex-1 flex flex-col justify-between border-t border-amber-400/30">
                    <div>
                      <div className="inline-block px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-black text-xs mb-2">
                        {person.role}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-200 transition leading-snug">
                        {person.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#f5d0fe]/90 font-medium pt-1">
                      {person.sub_role || person.subRole}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE LEADERBOARD TOP 5 PODIUM & FULL RANKING TABLE */}
      {topFive.length >= 3 && (
        <section id="leaderboard" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 w-full space-y-8">
          <div className="rounded-[36px] garden-luxury-dark text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 relative z-10">
              <div>
                <div className="inline-flex items-center text-[#e9d5ff] text-xs font-extrabold uppercase tracking-wider">
                  <span>REAL-TIME LEADERBOARD • ອັນດັບຄະແນນສົດ</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  <span>5 ອັນດັບຄະແນນສູງສຸດ (Top 5 Popular Vote)</span>
                </h2>
              </div>
              <div className="inline-flex items-center text-xs text-amber-200 font-bold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
                <span>ອັນດັບ 1 ໄດ້ເຂົ້າຮອບສຸດທ້າຍອັດຕະໂນມັດ (Fast Track Winner)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end relative z-10">
              {topFive.map((c, idx) => (
                <PodiumCard
                  key={c.id}
                  contestant={c}
                  rank={idx + 1}
                  totalVotes={totalVotes}
                  costumeMode={costumeMode}
                  onVote={() => openVoteModal(c)}
                />
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/15 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-black text-white">
                  <span>ຕາຕະລາງຄະແນນລວມທຸກໝາຍເລກ (Live Ranking Table)</span>
                </h3>
                <span className="text-xs text-white/75">
                  ລວມທັງໝົດ:{" "}
                  <strong className="text-amber-300">{totalVotes.toLocaleString()} Votes</strong>
                </span>
              </div>

              <div className="space-y-2.5">
                {rankedContestants.map((c, idx) => {
                  const pct =
                    totalVotes > 0
                      ? ((c.total_votes / totalVotes) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <div
                      key={c.id || c.code || idx}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span
                          className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            c.rank === 1
                              ? "bg-amber-400 text-[#240638]"
                              : c.rank === 2
                              ? "bg-[#c084fc] text-[#240638]"
                              : c.rank === 3
                              ? "bg-fuchsia-400 text-[#240638]"
                              : "bg-white/15 text-white"
                          }`}
                        >
                          #{c.rank}
                        </span>
                        <img
                          src={
                            costumeMode === "JEWELRY" && hasJewelryPhoto(c)
                              ? c.image_url
                              : (c.traditional_image_url || c.image_url)
                          }
                          alt={c.name}
                          onError={(e) => {
                            e.currentTarget.src = `/api/avatar?code=${c.code}&bg=garden&name=${encodeURIComponent(c.nickname)}`;
                          }}
                          className="w-11 h-11 rounded-xl object-cover border border-white/30 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-amber-300">
                              {c.code}
                            </span>
                            <span className="font-bold text-sm text-white truncate">
                              {c.name}
                            </span>
                            <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-purple-200">
                              {c.ethnic_group} • {c.province}
                            </span>
                          </div>
                          <div className="w-full max-w-md h-2 rounded-full bg-black/30 overflow-hidden mt-1.5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#c084fc] to-amber-300"
                              style={{
                                width: `${Math.min(100, Math.max(5, Number(pct)))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-auto">
                        <div className="text-right">
                          <div className="font-black text-sm sm:text-base text-amber-300">
                            {c.total_votes.toLocaleString()} Votes
                          </div>
                          <div className="text-[11px] text-white/70">{pct}% ຂອງຄະແນນລວມ</div>
                        </div>
                        <button
                          onClick={() => openVoteModal(c)}
                          className="inline-flex items-center px-4 py-2 rounded-xl font-black text-xs btn-gold-vote cursor-pointer"
                        >
                          <span>ໂຫວດ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 8-TIER VOTE PACKAGES SHOWCASE (INFORMATIONAL DISPLAY ONLY - NOT CLICKABLE) */}
          <div className="rounded-[32px] bg-white border border-[#9333ea]/25 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#6b1699]">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-[#9333ea]" />
                  <span>ຕາຕະລາງອັດຕາແພັກເກັດໂຫວດຢ່າງເປັນທາງການ (Official Voting Rates)</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#240638] mt-1">
                  ອັດຕາຄະແນນ ແລະ ລາຄາແພັກເກັດ (8 ລະດັບ)
                </h3>
                <p className="text-xs text-[#644180] font-medium mt-1">
                  ℹ️ ຕາຕະລາງແຈ້ງອັດຕາລາຄາ • ເລືອກໂຫວດໃຫ້ຜູ້ເຂົ້າປະກວດທີ່ທ່ານຊື່ນຊອບໄດ້ທີ່ລາຍຊື່ສາວງາມ (HM 01 - HM 20) ດ້ານລຸ່ມ 👇
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto bg-[#f8f4fc] p-1.5 rounded-2xl border border-[#9333ea]/25">
                <span className="text-xs font-bold text-[#644180] px-2">ສະກຸນເງິນ:</span>
                {[
                  { code: "LAK", label: "ກີບ (₭)", icon: Banknote },
                  { code: "THB", label: "ບາດ (฿)", icon: Coins },
                  { code: "USD", label: "ໂດລາ ($)", icon: DollarSign },
                ].map((cur) => {
                  const CurIcon = cur.icon;
                  return (
                    <button
                      key={cur.code}
                      type="button"
                      onClick={() => setCurrency(cur.code)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        currency === cur.code
                          ? "logo-exact-bg text-white shadow"
                          : "text-[#520d7a] hover:bg-white"
                      }`}
                    >
                      <CurIcon className="w-3.5 h-3.5" />
                      <span>{cur.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {packages.map((pkg, idx) => {
                const isSelected = selectedPkg?.id === pkg.id;
                const isPopular = pkg.points === 20;
                const isTopVip = pkg.points >= 1100;
                return (
                  <button
                    key={pkg.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedPkg(pkg);
                      const el = document.getElementById("contestants");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    title={`ຄລິກເພື່ອເລືອກແພັກເກັດ ${pkg.points} Votes (${formatPrice(pkg.price_lak)})`}
                    className={`relative rounded-2xl p-4 flex flex-col justify-between text-center border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                      isSelected
                        ? "bg-[#faf5ff] border-2 border-[#7e1db3] ring-2 ring-[#7e1db3]/25 shadow-md"
                        : isPopular
                        ? "bg-[#faf5ff] border-[#c084fc] hover:border-[#7e1db3]"
                        : isTopVip
                        ? "bg-amber-50/40 border-amber-300 hover:border-amber-400"
                        : "bg-white border-gray-200 hover:border-[#a855f7]"
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#7e1db3] text-white text-[9px] font-bold shadow-xs">
                        ຍອດນິຍົມ
                      </span>
                    )}
                    {isTopVip && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-[#240638] text-[9px] font-bold shadow-xs">
                        VIP
                      </span>
                    )}
                    <div className="pt-1">
                      <div className="text-2xl font-black text-[#2d0747]">
                        +{pkg.points.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-semibold text-gray-500">
                        {pkg.points === 1 ? "Vote" : "Votes"}
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100">
                      <div className="text-xs font-extrabold text-[#520d7a]">
                        {formatPrice(pkg.price_lak)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: ALL CONTESTANTS LUXURY GRID */}
      <section id="contestants" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* LUXURY FILTER & CONTROLS HEADER */}
        <div className="bg-white border border-[#9333ea]/20 rounded-3xl p-5 sm:p-7 shadow-[0_10px_35px_-5px_rgba(88,13,128,0.07)] mb-8 space-y-5">
          {/* TOP ROW: Title & Costume Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#9333ea]/15">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#7e1db3]/15 to-amber-500/15 text-[#580d80] text-xs font-black border border-[#7e1db3]/25 shadow-sm whitespace-nowrap shrink-0">
                  <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>OFFICIAL FINALISTS (HM 01 - HM 20)</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>1 Like = 1 ຄະແນນ • 1 Share = 1 ຄະແນນ • QR Vote ບໍ່ຈຳກັດ</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#240638] tracking-normal whitespace-nowrap">
                  ຜູ້ເຂົ້າປະກວດ ນາງສາວເຜົ່າມົ້ງ 2027
                </h2>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#f3ebfa] text-[#7e1db3] border border-[#7e1db3]/25 whitespace-nowrap shrink-0">
                  {costumeMode === "JEWELRY" ? "15 ໝາຍເລກ" : "ຄົບ 20 ໝາຍເລກ"}
                </span>
              </div>
            </div>

            {/* Luxury Costume Segmented Tabs */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#f5edfc] border border-[#9333ea]/25 shadow-inner self-start lg:self-center shrink-0">
              <button
                type="button"
                onClick={() => setCostumeMode("TRADITIONAL")}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  costumeMode === "TRADITIONAL"
                    ? "bg-gradient-to-r from-[#4c0d75] to-[#7e1db3] text-amber-300 shadow-md border border-amber-400/40"
                    : "text-[#580d80] hover:bg-white/80"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">ຊຸດມົ້ງດັ້ງເດີມ</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap shrink-0 transition-all ${
                    costumeMode === "TRADITIONAL"
                      ? "bg-amber-400 text-[#240638]"
                      : "bg-[#7e1db3]/15 text-[#580d80]"
                  }`}
                >
                  20 ຄົນ
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCostumeMode("JEWELRY")}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  costumeMode === "JEWELRY"
                    ? "bg-gradient-to-r from-[#854d0e] via-[#b45309] to-[#d97706] text-amber-50 shadow-md border border-amber-300/50"
                    : "text-[#78350f] hover:bg-white/80"
                }`}
              >
                <Gem className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">ຊຸດປະດັບຄຳພູວົງ</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap shrink-0 transition-all ${
                    costumeMode === "JEWELRY"
                      ? "bg-white text-[#854d0e] shadow-sm"
                      : "bg-amber-200/80 text-[#854d0e]"
                  }`}
                >
                  15 ຄົນ
                </span>
              </button>
            </div>
          </div>

          {/* BOTTOM ROW: Search & Sorting Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="w-4 h-4 text-[#7e1db3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ຄົ້ນຫາໝາຍເລກ HM 01 - HM 20 ຫຼື ຊື່ຜູ້ເຂົ້າປະກວດ..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#fbf8fd] border border-[#9333ea]/25 text-sm text-[#240638] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#7e1db3] focus:ring-2 focus:ring-[#7e1db3]/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Pills */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-bold text-[#644180] hidden md:inline whitespace-nowrap">ຈັດລຽງ:</span>
              <div className="inline-flex rounded-2xl bg-[#f5edfc] p-1 border border-[#9333ea]/20 shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setSortBy("VOTES")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    sortBy === "VOTES"
                      ? "bg-[#7e1db3] text-white shadow-sm"
                      : "text-[#580d80] hover:bg-white/60"
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">ຄະແນນສູງສຸດ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("CODE")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    sortBy === "CODE"
                      ? "bg-[#7e1db3] text-white shadow-sm"
                      : "text-[#580d80] hover:bg-white/60"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">ຕາມໝາຍເລກ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("HEARTS")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    sortBy === "HEARTS"
                      ? "bg-[#7e1db3] text-white shadow-sm"
                      : "text-[#580d80] hover:bg-white/60"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span className="whitespace-nowrap">ຍອດຫົວໃຈ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-banner for Jewelry mode notice only */}
          {costumeMode === "JEWELRY" && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/10 border border-amber-300/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="font-bold text-[#78350f] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ສະແດງຊຸດປະດັບຄຳ ຮ້ານຄຳພູວົງ (Phouvong Jewelry) 15 ໝາຍເລກ (HM 06 - HM 20) • ໝາຍເລກ HM 01 - HM 05 ກຳລັງລໍຖ້າຮູບຈາກກອງປະກວດ</span>
              </span>
              <button
                type="button"
                onClick={() => setCostumeMode("TRADITIONAL")}
                className="shrink-0 px-3 py-1 rounded-xl bg-gradient-to-r from-[#4c0d75] to-[#7e1db3] hover:opacity-95 text-amber-300 font-black shadow-sm transition cursor-pointer whitespace-nowrap"
              >
                ສະແດງຄົບ 20 ໝາຍເລກ (ຊຸດມົ້ງດັ້ງເດີມ)
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#6b1699] font-bold">
            ກຳລັງໂຫຼດຂໍ້ມູນສາວງາມ...
          </div>
        ) : filteredContestants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#9333ea]/20">
            <p className="text-[#644180]">ບໍ່ພົບຜູ້ເຂົ້າປະກວດທີ່ຄົ້ນຫາ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {filteredContestants.map((c, idx) => {
              const pct =
                totalVotes > 0 ? ((c.total_votes / totalVotes) * 100).toFixed(1) : "0.0";
              const hasJewelry = hasJewelryPhoto(c);
              const isJewelryView = costumeMode === "JEWELRY";
              const showJewelry = isJewelryView && hasJewelry;
              const displayImg = showJewelry
                ? c.image_url
                : (c.traditional_image_url || c.image_url);

              return (
                <div
                  key={c.id || c.code || idx}
                  className="group garden-card rounded-[28px] overflow-hidden flex flex-col"
                >
                  {isJewelryView && !hasJewelry ? (
                    <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-[#240638] to-[#12011f] flex flex-col items-center justify-center p-6 text-center border-2 border-amber-400/40">
                      <div className="w-14 h-14 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mb-3">
                        <Crown className="w-7 h-7 text-amber-300" />
                      </div>
                      <span className="text-amber-300 font-black text-sm mb-1">
                        ລໍຖ້າອັບເດດຮູບຊຸດປະດັບຄຳ
                      </span>
                      <span className="text-xs text-amber-200/70 mb-4">
                        ຮ້ານຄຳພູວົງ Phouvong Jewelry
                      </span>
                      <button
                        type="button"
                        onClick={() => setCostumeMode("TRADITIONAL")}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7e1db3] to-[#580d80] text-amber-300 text-xs font-bold border border-amber-400/40 hover:scale-105 transition cursor-pointer"
                      >
                        ເບິ່ງຊຸດມົ້ງດັ້ງເດີມ
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setDetailContestant(c);
                        setDetailCostume(costumeMode);
                      }}
                      className="relative aspect-[3/4] w-full bg-[#35064f] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={displayImg}
                        alt={c.name}
                        onError={(e) => {
                          e.currentTarget.src = `/api/avatar?code=${c.code}&bg=garden&name=${encodeURIComponent(c.nickname)}`;
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                      />

                      {/* Costume Tag Indicator */}
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black border shadow-md backdrop-blur-md ${
                          showJewelry
                            ? "bg-[#7f1d1d]/90 text-amber-200 border-amber-400/50"
                            : "bg-[#240638]/90 text-amber-300 border-amber-400/50"
                        }`}
                      >
                        {showJewelry ? "ຊຸດປະດັບຄຳ" : "ຊຸດມົ້ງດັ້ງເດີມ"}
                      </span>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-xl font-extrabold text-xs shadow-lg ${
                          c.rank === 1
                            ? "bg-amber-400 text-[#240638]"
                            : c.rank === 2
                            ? "bg-[#c084fc] text-[#240638]"
                            : c.rank === 3
                            ? "bg-fuchsia-600 text-white"
                            : "bg-black/70 backdrop-blur-md text-white border border-white/25"
                        }`}
                      >
                        {c.rank <= 3 ? `ອັນດັບ ${c.rank}` : `ອັນດັບ #${c.rank}`}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleSendHeart(e, c)}
                        className={`px-3 py-1.5 rounded-full bg-white/95 hover:bg-rose-500 hover:text-white text-rose-600 flex items-center gap-1 text-xs font-extrabold transition shadow-lg cursor-pointer ${
                          heartPopId === c.id ? "scale-125 bg-rose-500 text-white" : ""
                        }`}
                        title="ກົດສົ່ງຫົວໃຈເຊຍຟຣີ!"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>{c.hearts ?? 0}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailContestant(c);
                        }}
                        className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md shadow-lg cursor-pointer"
                        title="ເບິ່ງປະຫວັດລະອຽດ"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg logo-exact-bg text-white font-black text-xs shadow-sm">
                          {c.code}
                        </span>
                        <span className="text-[11px] text-[#644180] font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#9333ea]" />
                          <span>{c.province}</span>
                        </span>
                      </div>
                      <h3 className="font-black text-base sm:text-lg text-[#240638] mt-1.5 leading-snug">
                        {c.name}
                      </h3>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#9333ea]/15 space-y-3">
                      <div>
                        <div className="flex items-baseline justify-between text-xs mb-1">
                          <span className="text-[#644180] font-semibold">ຄະແນນໂຫວດ:</span>
                          <span className="font-black text-base text-[#520d7a]">
                            {c.total_votes.toLocaleString()}{" "}
                            <span className="text-xs font-bold text-[#9333ea]">
                              Votes ({pct}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#f3ebfa] overflow-hidden">
                          <div
                            className="h-full rounded-full logo-exact-bg transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(6, Number(pct)))}%` }}
                          />
                        </div>
                      </div>

                      <button
                        disabled={!votingOpen}
                        onClick={() => openVoteModal(c)}
                        className="w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center btn-garden-vote disabled:opacity-40 cursor-pointer"
                      >
                        <span>{votingOpen ? `ໂຫວດໃຫ້ ${c.code}` : "ປິດຮັບໂຫວດແລ້ວ"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================== SECTION: HALL OF FAME / PAST QUEENS ==================== */}
      <section id="past-queens" className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#1c022e] via-[#24043b] to-[#160124] text-white border-y border-amber-400/30">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 font-black text-xs uppercase tracking-wider mb-3 shadow-sm">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>HALL OF FAME • ຫໍກຽດຕິຍົດແຫ່ງມົງກຸດ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-normal">
              ອະດີດນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ
            </h2>
            <p className="text-sm text-purple-200/80 mt-2.5 font-medium leading-relaxed">
              ຕຳນານມົງກຸດແຫ່ງຄວາມພາກພູມໃຈ ຂອງສາວງາມເຜົ່າມົ້ງ ນະຄອນຫຼວງວຽງຈັນ (2019 - 2026)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pastQueens.map((q, idx) => {
              const isHighlight = q.year === "2020" || q.year === "2026";
              return (
                <div
                  key={q.id || q.year || idx}
                  className={`relative rounded-3xl p-6 flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1.5 shadow-xl border ${
                    isHighlight
                      ? "bg-gradient-to-b from-[#340753] to-[#1e0332] border-2 border-amber-400 shadow-amber-400/15 ring-1 ring-amber-400/30"
                      : "bg-[#25043a] border-purple-500/30 hover:border-amber-400/60"
                  }`}
                >
                  <div>
                    {/* Year badge */}
                    <div className="flex justify-center mb-4">
                      <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-[#240638] font-black text-xs shadow-md">
                        👑 ປີ {q.year}
                      </span>
                    </div>

                    {/* Queen Photo / Avatar */}
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      <img
                        src={q.image_url}
                        alt={q.name}
                        onError={(e) => {
                          e.currentTarget.src = `/api/avatar?code=${q.year}&bg=gold&name=${encodeURIComponent(q.name)}`;
                        }}
                        className="w-full h-full object-cover rounded-full border-4 border-amber-400/80 shadow-lg p-0.5 bg-white/10"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-[#240638] flex items-center justify-center font-black text-xs shadow">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Name & Title */}
                    <h3 className="font-black text-base sm:text-lg text-white">
                      {q.name}
                    </h3>
                    <p className="text-xs text-amber-200/90 font-bold mt-1">
                      {q.title}
                    </p>

                    {/* Special Achievement Badge */}
                    {q.badge && (
                      <div className="mt-2.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-900/80 border border-amber-400/40 text-amber-300 font-bold text-[11px] leading-tight">
                          ✨ {q.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-purple-200/70 mt-4 pt-3 border-t border-white/10 leading-relaxed italic">
                    &ldquo;{q.bio}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: TICKETS */}
      <section id="tickets" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="rounded-[36px] garden-luxury-dark text-white p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center text-[#e9d5ff] text-xs font-extrabold uppercase tracking-wider">
                <span>GRAND FINALE TICKETS • ປີ້ເຂົ້າຊົມຮອບຕັດສິນ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                <span>ຈອງປີ້ເຂົ້າຊົມຄ່ຳຄືນຮອບຕັດສິນ (ພ້ອມຮັບຄະແນນໂຫວດຟຣີ!)</span>
              </h2>
            </div>
            <p className="text-xs text-white/80 max-w-md">
              ຈັດຂຶ້ນໃນວັນທີ 25 ພະຈິກ 2026 ທີ່ ເວທີຫຼັກ ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden).
              ທຸກບັດເຂົ້າຊົມແຖມຟຣີຄະແນນໂຫວດສຳລັບໝາຍເລກທີ່ທ່ານເຊຍ!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ticketList.map((t, idx) => (
              <div
                key={t.id || idx}
                className={`rounded-3xl p-6 flex flex-col justify-between relative ${
                  t.popular
                    ? "bg-white text-[#240638] border-4 border-amber-400 shadow-2xl"
                    : "bg-white/10 backdrop-blur-md text-white border border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center text-[11px] px-3 py-0.5 rounded-full font-black ${
                        t.popular
                          ? "bg-amber-400 text-[#240638]"
                          : "bg-[#c084fc] text-[#1f0330]"
                      }`}
                    >
                      <span>{t.badge}</span>
                    </span>
                    <span className="text-xs font-extrabold text-amber-300">
                      ແຖມຟຣີ +{t.bonus_votes ?? t.bonusVotes} Votes
                    </span>
                  </div>

                  <h3 className="font-black text-lg">{t.name_lao || t.nameLao}</h3>
                  <div
                    className={`text-xs mt-0.5 ${
                      t.popular ? "text-[#644180]" : "text-white/75"
                    }`}
                  >
                    {t.zone || t.Zone}
                  </div>

                  <div className="my-4">
                    <span
                      className={`text-2xl sm:text-3xl font-black ${
                        t.popular ? "text-[#520d7a]" : "text-amber-300"
                      }`}
                    >
                      {formatPrice(t.price_lak ?? t.priceLak)}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs">
                    {t.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            t.popular ? "text-[#7e1db3]" : "text-[#e9d5ff]"
                          }`}
                        />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setBookingTicket(t);
                    setTicketBookedSuccess(false);
                  }}
                  className={`mt-6 w-full py-3 rounded-2xl font-black text-xs inline-flex items-center justify-center cursor-pointer ${
                    t.popular ? "btn-garden-vote" : "btn-gold-vote"
                  }`}
                >
                  <span>ຈອງປີ້ {t.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SCHEDULE */}
      <section id="schedule" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="rounded-[32px] bg-white border border-[#9333ea]/25 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl logo-exact-bg flex items-center justify-center text-white shadow-md">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#6b1699]">
                  OFFICIAL EVENT SCHEDULE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#240638]">
                  ຕາຕະລາງກິດຈະກຳ ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2026
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {scheduleList.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                  (item.is_live ?? item.live)
                    ? "bg-[#f5edfc] border-[#9333ea] shadow-md"
                    : "bg-[#faf7fd] border-[#9333ea]/15"
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="px-3.5 py-2 rounded-2xl logo-exact-bg text-white text-center shrink-0 min-w-[115px]">
                    <div className="text-xs font-black">{item.date}</div>
                    <div className="text-[10px] text-white/85">{item.time}</div>
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-[#240638]">
                      {item.title}
                    </h3>
                    <div className="text-xs text-[#644180] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#9333ea]" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-black ${
                      (item.is_live ?? item.live)
                        ? "bg-amber-400 text-[#240638]"
                        : (item.is_done ?? item.done)
                        ? "bg-[#a855f7]/25 text-[#380957]"
                        : "bg-white border border-[#9333ea]/30 text-[#520d7a]"
                    }`}
                  >
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: NEWS & ACTIVITIES */}
      <section id="news" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        <div className="rounded-[32px] bg-white border border-[#9333ea]/25 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl logo-exact-bg flex items-center justify-center text-white shadow-md shrink-0">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#6b1699]">
                  NEWS & ACTIVITIES • ຂ່າວສານ & ພາບບັນຍາກາດກິດຈະກຳ
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#240638] mt-0.5">
                  ຂ່າວສານ ແລະ ບັນຍາກາດກິດຈະກຳກອງປະກວດລ່າສຸດ
                </h2>
              </div>
            </div>

            {/* Carousel Navigation Buttons & Counter */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {/* Auto-Slide Toggle Button */}
              <button
                type="button"
                onClick={() => setIsAutoPlayNews(!isAutoPlayNews)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                  isAutoPlayNews
                    ? "bg-amber-400/20 text-amber-800 border-amber-400/50 shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-500 border-gray-200"
                }`}
                title={isAutoPlayNews ? "ກົດເພື່ອຢຸດສະໄລ້" : "ກົດເພື່ອເປີດສະໄລ້ອັດຕະໂນມັດ"}
              >
                <span className={`w-2 h-2 rounded-full ${isAutoPlayNews ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                <span>{isAutoPlayNews ? "ສະໄລ້ອັດຕະໂນມັດ" : "ຢຸດສະໄລ້"}</span>
              </button>

              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#9333ea]/20 shadow-sm">
                <button
                  type="button"
                  onClick={() => scrollNews("left")}
                  disabled={!canScrollNewsLeft}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#f6effc] text-[#520d7a]"
                  title="ເລື່ອນໄປຊ້າຍ"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="h-4 w-px bg-gray-200" />
                <button
                  type="button"
                  onClick={() => scrollNews("right")}
                  disabled={!canScrollNewsRight}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#f6effc] text-[#520d7a]"
                  title="ເລື່ອນໄປຂວາ"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* News Filter Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "ALL", label: `ທັງໝົດ (${newsList.length})` },
              {
                id: "CAMP",
                label: `📸 ພາບບັນຍາກາດກິດຈະກຳເກັບໂຕ (${
                  newsList.filter(
                    (n) =>
                      n.type === "gallery" ||
                      n.category?.includes("ເກັບໂຕ") ||
                      n.category?.includes("ກິດຈະກຳ") ||
                      n.title?.includes("ເກັບໂຕ")
                  ).length || 2
                })`,
              },
              { id: "OFFICIAL", label: "👑 ຂ່າວກອງປະກວດ & ຜູ້ບໍລິຫານ" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setNewsFilterCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap shrink-0 ${
                  newsFilterCategory === cat.id
                    ? "logo-exact-bg text-amber-300 shadow-sm border border-amber-400/40"
                    : "bg-[#f3ebfa] hover:bg-[#e9d5ff] text-[#520d7a] border border-[#9333ea]/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ==================== INTERACTIVE CARD SLIDER (ກາດສະໄລ້) ==================== */}
          <div className="relative group">
            <div
              ref={newsSliderRef}
              onScroll={handleNewsScroll}
              onMouseEnter={() => setIsNewsHovered(true)}
              onMouseLeave={() => setIsNewsHovered(false)}
              onTouchStart={() => setIsNewsHovered(true)}
              onTouchEnd={() => setIsNewsHovered(false)}
              className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredNewsList.map((news, idx) => (
                <div
                  key={news.id || idx}
                  onClick={() => {
                    setSelectedNewsDetail(news);
                    setActiveNewsImageIndex(0);
                  }}
                  className="min-w-[85%] sm:min-w-[46%] lg:min-w-[31.8%] max-w-[85%] sm:max-w-[46%] lg:max-w-[31.8%] snap-start shrink-0 group garden-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-[#9333ea]/20 cursor-pointer bg-white"
                >
                  {/* Editorial Photo Banner */}
                  <div className="h-56 w-full overflow-hidden garden-luxury-dark p-3 flex items-center justify-center relative">
                    {news.type === "chairman" && (
                      <div className="w-full h-full flex items-center gap-3.5 px-2">
                        <div className="h-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shrink-0 bg-white">
                          <img
                            src={news.images?.[0] || "/committee/img3.jpg"}
                            alt={news.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                          />
                        </div>
                        <div className="flex-1 text-white space-y-2">
                          <div className="inline-flex items-center px-3 py-1 rounded-xl border border-amber-400/40 bg-white/10 text-amber-300 text-[11px] font-black">
                            <span>MHVT 2027 • ສວນບັນດາເຜົ່າ</span>
                          </div>
                          <div className="text-xs font-black text-amber-300 leading-snug">
                            ປະທານ ພູວົງ ພະມີສິດ
                          </div>
                          <div className="text-[11px] text-white/85 leading-relaxed">
                            ປະທານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ
                          </div>
                        </div>
                      </div>
                    )}

                    {news.type === "gallery" && (
                      <div className="w-full h-full grid grid-cols-3 gap-2 items-center">
                        {(news.images || ["/activities/act1.jpg"]).slice(0, 3).map((imgUrl, i) => (
                          <div
                            key={i}
                            className="h-full rounded-xl overflow-hidden border border-amber-400/40 bg-[#35064f] shadow-sm relative"
                          >
                            <img
                              src={imgUrl}
                              alt={`Activity ${i + 1}`}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                            />
                            {i === 2 && news.images && news.images.length > 3 && (
                              <div className="absolute inset-0 bg-black/65 flex items-center justify-center text-amber-300 font-black text-xs backdrop-blur-[1px]">
                                +{news.images.length - 3} ຮູບ
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {news.type === "committee" && (
                      <div className="w-full h-full grid grid-cols-4 gap-2 items-center">
                        {(news.images || ["/committee/img5.jpg"]).map((imgUrl, i) => (
                          <div
                            key={i}
                            className="h-full rounded-xl overflow-hidden border border-white/30 bg-white shadow-sm"
                          >
                            <img
                              src={imgUrl}
                              alt={`Committee ${i + 1}`}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {news.type === "contestants" && (
                      <div className="w-full h-full grid grid-cols-3 gap-2 items-center">
                        {(news.images || ["/contestants/hm01.jpg"]).map((imgUrl, i) => (
                          <div
                            key={i}
                            className="h-full rounded-xl overflow-hidden border border-amber-400/50 bg-[#35064f] shadow-sm"
                          >
                            <img
                              src={imgUrl}
                              alt={`Contestant ${i + 1}`}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {news.type !== "chairman" && news.type !== "committee" && news.type !== "contestants" && news.type !== "gallery" && (
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-black/30">
                        <img
                          src={news.images?.[0] || "/committee/img3.jpg"}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}

                    {/* Image count badge */}
                    {news.images && news.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 text-white font-mono text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 border border-white/20">
                        <span>📸 {news.images.length} ຮູບ</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f3ebfa] text-[#520d7a] text-[11px] font-extrabold border border-[#9333ea]/15">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-500 font-semibold font-mono">
                          {news.date}
                        </span>
                      </div>
                      <h3 className="font-black text-base text-[#240638] leading-snug line-clamp-2 group-hover:text-[#6b1699] transition">
                        {news.title}
                      </h3>
                      <p className="text-xs text-[#644180] mt-2 leading-relaxed line-clamp-3">
                        {news.summary || news.excerpt || news.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-black text-[#6b1699] group-hover:text-[#9333ea]">
                      <span className="flex items-center gap-1">
                        <span>ອ່ານລາຍລະອຽດ & ເບິ່ງຮູບ</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </span>
                      <span className="text-[11px] text-[#644180] font-normal">
                        ກົດເພື່ອເປີດອ່ານ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Swipe Instruction on Mobile */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 text-xs text-[#644180] pt-2">
              <span>👈 ປັດເລື່ອນຊ້າຍ-ຂວາ ເພື່ອເບິ່ງຂ່າວອື່ນໆ 👉</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRIZES, SPONSORS & ABOUT LAO ETHNIC GARDEN (PHEUKSA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-10">
        {/* Official Grand Prizes Section */}
        <div className="rounded-[32px] bg-white border border-[#9333ea]/25 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#6b1699]">
              <span>OFFICIAL PAGEANT PRIZES • ລາງວັນອັນຊົງກຽດ</span>
            </span>
            <h2 className="text-2xl font-black text-[#240638] mt-1">
              ລາງວັນກຽດຕິຍົດ ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ
            </h2>
            <p className="text-xs text-[#644180] mt-1">
              ສະໜັບສະໜູນມົງກຸດ, ສາຍສະພາຍ ແລະ ລາງວັນໂດຍ ຮ້ານຄຳພູວົງ (Phouvong Jewelry) & ໂຄງການ ສວນບັນດາເຜົ່າ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRIZE_TIERS.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 flex flex-col justify-between border-2 transition ${
                  item.highlight
                    ? "bg-gradient-to-b from-amber-50/90 to-white border-amber-400 shadow-lg"
                    : "bg-[#f8f3fc] border-[#9333ea]/25"
                }`}
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3ebfa] text-[#520d7a] text-xs font-black">
                    <span>{item.rank}</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-[#240638]">
                    {item.prize}
                  </div>
                  <p className="text-xs text-[#644180] leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsors */}
        <div
          id="sponsors"
          className="rounded-[32px] bg-white border border-[#9333ea]/25 p-6 sm:p-8 shadow-xl space-y-6"
        >
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#6b1699]">
              <span>OFFICIAL ORGANIZERS & CO-HOSTS • 3 ໂລໂກ້ຫຼັກຂອງກອງປະກວດ</span>
            </span>
            <div className="max-w-xl mx-auto rounded-2xl overflow-hidden border border-amber-400/50 bg-[#240638] p-2 shadow-lg">
              <img
                src="/official_pageant_logos.jpg"
                alt="3 ໂລໂກ້ຫຼັກຂອງກອງປະກວດ: ຮ້ານຄຳພູວົງ • MHVT 2027 • ສວນບັນດາເຜົ່າ"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            <h2 className="text-2xl font-black text-[#240638] mt-2">
              ຜູ້ສະໜັບສະໜູນຫຼັກຢ່າງເປັນທາງການ
            </h2>
          </div>

          <div className="space-y-6">
            {formattedSponsors.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-xs font-black text-center text-[#644180] uppercase tracking-wider">
                  {group.tier}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {group.items.map((sp, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#f9f5fd] border border-[#9333ea]/25 text-center flex flex-col items-center justify-center hover:border-[#9333ea] transition"
                    >
                      <div className="w-10 h-10 rounded-xl logo-exact-bg text-white flex items-center justify-center font-black text-sm mb-2 shadow">
                        <Handshake className="w-5 h-5" />
                      </div>
                      <div className="font-extrabold text-xs text-[#240638]">
                        {sp.name}
                      </div>
                      <div className="text-[11px] text-[#9333ea] font-semibold mt-0.5">
                        {sp.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Us & Official PHEUKSA / Lao Ethnic Garden Details */}
        <div
          id="about"
          className="rounded-[32px] logo-exact-bg text-white p-6 sm:p-10 shadow-2xl space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-[#2a0540]">
                <img
                  src="/contestants/hm01.jpg"
                  alt="Miss Hmong Vientiane 2027 • ສວນບັນດາເຜົ່າ"
                  className="w-full h-72 object-cover object-top"
                />
              </div>

              <div className="rounded-2xl bg-black/20 backdrop-blur-md border border-white/25 p-4 space-y-2.5 text-xs">
                <div className="font-black text-amber-200 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>ສະຖານທີ່ຈັດງານ & ຂໍ້ມູນຕິດຕໍ່ທາງການ</span>
                </div>
                <div className="flex items-start gap-2 text-white/95">
                  <MapPin className="w-4 h-4 text-[#f5d0fe] shrink-0 mt-0.5" />
                  <span>{VENUE_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2 text-white/95">
                  <Phone className="w-4 h-4 text-[#f5d0fe] shrink-0" />
                  <span>{VENUE_INFO.phones.join(" • ")}</span>
                </div>
                <div className="flex items-center gap-2 text-white/95">
                  <Mail className="w-4 h-4 text-[#f5d0fe] shrink-0" />
                  <span>{VENUE_INFO.email}</span>
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={VENUE_INFO.facebookPhotosUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#240638] font-black text-xs hover:bg-amber-200 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Facebook: PHEUKSA / ສວນບັນດາເຜົ່າ</span>
                  </a>
                  <a
                    href={VENUE_INFO.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 border border-white/30 text-white font-bold text-xs hover:bg-white/25 transition"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>laoethnicgarden.com</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/20 text-xs font-black">
                <span>ABOUT LAO ETHNIC GARDEN (PHEUKSA) • ກ່ຽວກັບໂຄງການ ສວນບັນດາເຜົ່າ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-snug">
                ສວນບັນດາເຜົ່າ / Lao Ethnic Garden & ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027
              </h2>
              <p className="text-sm text-white/95 leading-relaxed">
                <strong>ສວນບັນດາເຜົ່າ / Lao Ethnic Garden (ສວນພຶກສາ PHEUKSA • ຜູ້ຕິດຕາມເພຈ 63,000+ ຄົນ)</strong>{" "}
                ຕັ້ງຢູ່ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ ນະຄອນຫຼວງວຽງຈັນ ກໍ່ຕັ້ງໂດຍ{" "}
                <strong>ປະທານ ພູວົງ ພະມີສິດ</strong> (ປະທານກຸ່ມບໍລິສັດ ຄຳພູວົງ KPV Group ແລະ ຮ້ານຄຳພູວົງ Phouvong Jewelry)
                ຮ່ວມຈັດການປະກວດ <strong>Miss Hmong Vientiane 2027</strong> ຊິງຕຳແໜ່ງ ແລະ ເງິນລາງວັນລວມມູນຄ່າ{" "}
                <strong>500 ກວ່າລ້ານກີບ</strong> (ຕໍ່ຍອດຄວາມສຳເລັດຈາກ <strong>ນ້ອງ ເກ້ຍເຮີ</strong> ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2026)
                ຄວບຄູ່ກັບ <strong>ກອງປະກວດ ນັກຮ້ອງສຽງດີ ປະຈຳປີ 2027</strong>.
              </p>

              <div className="space-y-2">
                <div className="text-xs font-black text-amber-200 uppercase tracking-wider">
                  ກິດຈະກຳທ່ອງທ່ຽວພາຍໃນ ສວນບັນດາເຜົ່າ (7 ໂຊນຫຼັກ):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VENUE_INFO.highlights.map((hl, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-black/20 border border-white/20 flex items-start gap-2 text-xs text-white/95"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#f5d0fe] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-xs font-black text-amber-200 uppercase tracking-wider">
                  ເງື່ອນໄຂຜູ້ສະໝັກ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VENUE_INFO.eligibilityRules.map((rule, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white/10 border border-white/20 flex items-start gap-2 text-xs text-white/95"
                    >
                      <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/25">
                  <div className="font-black text-amber-200 text-sm">
                    <span>ອະນຸລັກວັດທະນະທຳ</span>
                  </div>
                  <div className="text-xs text-white/85 mt-1">
                    ສົ່ງເສີມຊຸດມົ້ງດັ້ງເດີມ ແລະ ເວທີແມ່ຍິງຊົນເຜົ່າມົ້ງ
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/25">
                  <div className="font-black text-amber-200 text-sm">
                    <span>ລາງວັນ 500+ ລ້ານກີບ</span>
                  </div>
                  <div className="text-xs text-white/85 mt-1">
                    ມົງກຸດ, ສາຍສະພາຍ ແລະ ເຄື່ອງປະດັບຈາກ ຮ້ານຄຳພູວົງ
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/25">
                  <div className="font-black text-amber-200 text-sm">
                    <span>ຂວັນໃຈໂຊຊຽວ & QR</span>
                  </div>
                  <div className="text-xs text-white/85 mt-1">
                    1 Like = 1 ຄະແນນ • 1 Share = 1 ຄະແນນ + QR Vote
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1c032b] text-white py-10 mt-auto border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3.5">
            <div className="h-14 px-2 py-1 rounded-xl border border-amber-400/50 bg-[#240638] flex items-center shadow shrink-0">
              <img
                src="/logo_mhvt.png"
                alt="MHVT Miss Hmong Vientiane 2027"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-black text-sm text-white">
                ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • MHVT 2027
              </div>
              <div className="text-white/75 mt-0.5">
                ຮ້ານຄຳພູວົງ (Phouvong Jewelry) • ສວນບັນດາເຜົ່າ (Lao Ethnic Garden • PHEUKSA)
              </div>
              <div className="text-white/60 text-[11px] mt-0.5">
                ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ ນະຄອນຫຼວງວຽງຈັນ • ໂທ: +856 20 5551 2635 • ຮອງຮັບ BCEL OnePay & APB Lao QR
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.facebook.com/PHEUKSA/photos"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold transition"
            >
              <ExternalLink className="w-4 h-4 text-[#e9d5ff]" />
              <span>ເພຈ Facebook (PHEUKSA)</span>
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold transition"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>ເຂົ້າສູ່ລະບົບຈັດການຫຼັງບ້ານ (Admin Dashboard)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>

      {/* CONTESTANT DETAIL MODAL */}
      {detailContestant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border-2 border-[#a855f7]">
            <div className="flex items-center justify-between p-4 logo-exact-bg text-white">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-white text-[#240638] font-black text-xs">
                  {detailContestant.code}
                </span>
                <h3 className="font-black text-white">{detailContestant.name}</h3>
              </div>
              <button
                onClick={() => setDetailContestant(null)}
                className="p-1.5 rounded-xl bg-black/20 text-white hover:bg-black/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-[#a855f7]/40 shadow-md bg-[#240638]">
                <img
                  src={
                    detailCostume === "JEWELRY" && hasJewelryPhoto(detailContestant)
                      ? detailContestant.image_url
                      : (detailContestant.traditional_image_url || detailContestant.image_url)
                  }
                  alt={detailContestant.name}
                  onError={(e) => {
                    e.currentTarget.src = `/api/avatar?code=${detailContestant.code}&bg=garden&name=${encodeURIComponent(detailContestant.nickname)}`;
                  }}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/75 text-amber-300 border border-amber-400/40 backdrop-blur-sm">
                  {detailCostume === "JEWELRY" && hasJewelryPhoto(detailContestant)
                    ? "ຊຸດປະດັບຄຳ"
                    : "ຊຸດມົ້ງດັ້ງເດີມ"}
                </span>

                {/* If contestant has both costumes, allow switching in modal */}
                {hasJewelryPhoto(detailContestant) && (
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center gap-1.5 p-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/20">
                    <button
                      type="button"
                      onClick={() => setDetailCostume("TRADITIONAL")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                        detailCostume === "TRADITIONAL"
                          ? "bg-[#7e1db3] text-amber-300 shadow"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      ຊຸດມົ້ງດັ້ງເດີມ
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailCostume("JEWELRY")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                        detailCostume === "JEWELRY"
                          ? "bg-[#991b1b] text-amber-300 shadow"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      ຊຸດປະດັບຄຳ
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-3 text-sm text-[#240638]">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3ebfa] border border-[#9333ea]/30 text-[#520d7a] text-xs font-extrabold">
                  <span>{detailContestant.ethnic_group || "ຕົວແທນບັນ端ເຜົ່າ"}</span>
                </div>
                <div>
                  <span className="text-[#644180] text-xs">ຊື່ຫຼິ້ນ:</span>
                  <div className="font-extrabold text-[#240638]">
                    {detailContestant.nickname}
                  </div>
                </div>
                <div>
                  <span className="text-[#644180] text-xs">ຕົວແທນຈາກ:</span>
                  <div className="font-extrabold text-[#6b1699]">
                    {detailContestant.province}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#f8f4fc] border border-[#9333ea]/20">
                    <div className="text-[11px] text-[#644180]">ອາຍຸ</div>
                    <div className="font-black text-[#240638]">{detailContestant.age} ປີ</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f8f4fc] border border-[#9333ea]/20">
                    <div className="text-[11px] text-[#644180]">ລວງສູງ</div>
                    <div className="font-black text-[#240638]">
                      {detailContestant.height} cm
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[#644180] text-xs">ຄະຕິປະຈຳໃຈ:</span>
                  <p className="text-[#380957] text-xs leading-relaxed mt-1 italic">
                    &ldquo;{detailContestant.bio}&rdquo;
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      const c = detailContestant;
                      setDetailContestant(null);
                      openVoteModal(c);
                    }}
                    className="w-full py-3 rounded-xl font-black text-sm btn-garden-vote inline-flex items-center justify-center cursor-pointer"
                  >
                    <span>ໂຫວດໃຫ້ {detailContestant.code} ເລີຍ</span>
                  </button>
                  <button
                    onClick={() =>
                      handleCopyShare(
                        `ຮ່ວມໂຫວດເຊຍ ${detailContestant.code} - ${detailContestant.name} ໃນກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ • ສວນບັນດາເຜົ່າ!`
                      )
                    }
                    className="w-full py-2 rounded-xl bg-[#f3ebfa] hover:bg-[#e9d5ff] text-[#520d7a] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#6b1699]" />
                        <span>ກ໊ອບປີ້ຂໍ້ຄວາມຊວນໂຫວດແລ້ວ!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>ແຊຣ໌ຊວນໝູ່ມາຊ່ວຍໂຫວດ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TICKET BOOKING MODAL */}
      {bookingTicket && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#a855f7]">
            <div className="flex items-center justify-between p-4 logo-exact-bg text-white">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-200" />
                <h3 className="font-black text-white">ຈອງປີ້ເຂົ້າຊົມຮອບຕັດສິນ</h3>
              </div>
              <button
                onClick={() => setBookingTicket(null)}
                className="p-1.5 rounded-xl bg-black/20 text-white hover:bg-black/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {ticketBookedSuccess ? (
              <div className="p-6 text-center space-y-4 text-[#240638]">
                <div className="w-14 h-14 rounded-full bg-[#a855f7]/25 text-[#520d7a] flex items-center justify-center mx-auto">
                  <PartyPopper className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black">ຈອງປີ້ເຂົ້າຊົມສຳເລັດ! (E-Ticket Pass)</h4>
                <div className="p-4 rounded-2xl bg-[#f6effc] border border-[#9333ea]/30 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#644180]">ປະເພດບັດ:</span>
                    <span className="font-black text-[#520d7a]">{bookingTicket.nameLao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#644180]">ຈຳນວນ:</span>
                    <span className="font-bold">{ticketQty} ບັດ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#644180]">ຄະແນນໂຫວດແຖມຟຣີ:</span>
                    <span className="font-black text-amber-600">
                      +{bookingTicket.bonusVotes * ticketQty} Votes
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setBookingTicket(null)}
                  className="w-full py-2.5 rounded-xl font-black text-xs btn-garden-vote cursor-pointer"
                >
                  ປິດໜ້າຕ່າງນີ້
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4 text-xs text-[#240638]">
                <div className="p-3.5 rounded-2xl bg-[#f6effc] border border-[#9333ea]/30 flex justify-between items-center">
                  <div>
                    <div className="font-black text-sm text-[#240638]">
                      {bookingTicket.name_lao || bookingTicket.nameLao}
                    </div>
                    <div className="text-[#644180]">
                      ແຖມຟຣີ +{bookingTicket.bonus_votes ?? bookingTicket.bonusVotes} Votes / ບັດ
                    </div>
                  </div>
                  <div className="font-black text-base text-[#520d7a]">
                    {formatPrice(bookingTicket.price_lak ?? bookingTicket.priceLak)}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#644180] mb-1">ຊື່ຜູ້ຈອງປີ້</label>
                  <input
                    type="text"
                    value={ticketBuyerName}
                    onChange={(e) => setTicketBuyerName(e.target.value)}
                    placeholder="ປ້ອນຊື່ ແລະ ນາມສະກຸນ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ເບີໂທ WhatsApp
                    </label>
                    <input
                      type="text"
                      value={ticketBuyerPhone}
                      onChange={(e) => setTicketBuyerPhone(e.target.value)}
                      placeholder="020 xxxx xxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#644180] mb-1">ຈຳນວນບັດ</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={ticketQty}
                      onChange={(e) => setTicketQty(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 font-black"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setTicketBookedSuccess(true)}
                  className="w-full py-3 rounded-xl font-black text-sm btn-garden-vote cursor-pointer"
                >
                  ຢືນຢັນການຈອງປີ້ ({formatPrice((bookingTicket.price_lak ?? bookingTicket.priceLak) * ticketQty)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== MODAL: NEWS DETAIL POPUP ==================== */}
      {selectedNewsDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 logo-exact-bg text-white">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  {selectedNewsDetail.category}
                </span>
                <span className="text-xs text-white/70">• {selectedNewsDetail.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNewsDetail(null)}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-[#240638]">
              {/* Photo Showcase */}
              {selectedNewsDetail.images && selectedNewsDetail.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#160224] max-h-[400px] flex items-center justify-center relative shadow-inner">
                  <img
                    src={selectedNewsDetail.images[activeNewsImageIndex] || selectedNewsDetail.images[0]}
                    alt={selectedNewsDetail.title}
                    className="w-full h-full object-contain max-h-[380px]"
                  />
                  {selectedNewsDetail.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/75 text-amber-300 text-xs font-mono font-bold backdrop-blur-sm border border-white/20">
                      {(activeNewsImageIndex || 0) + 1} / {selectedNewsDetail.images.length} ຮູບ
                    </div>
                  )}
                </div>
              )}

              {/* Gallery thumbnails if multiple */}
              {selectedNewsDetail.images && selectedNewsDetail.images.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {selectedNewsDetail.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveNewsImageIndex(idx)}
                      className={`h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        (activeNewsImageIndex || 0) === idx
                          ? "border-amber-400 ring-2 ring-amber-400/50 scale-105"
                          : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Facebook Album Banner if gallery or camp activities */}
              {(selectedNewsDetail.type === "gallery" || selectedNewsDetail.images?.length > 2) && (
                <div className="p-3.5 rounded-2xl bg-[#f9f5fd] border border-[#9333ea]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-[#520d7a] font-bold">
                    📸 ຕິດຕາມຊຸດຮູບຖ່າຍເຕັມ 100+ ຮູບຂອງກິດຈະກຳເກັບໂຕ ທີ່ເພຈທາງການ
                  </span>
                  <a
                    href={VENUE_INFO.facebookPhotosUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f3ebfa] border border-[#9333ea]/30 text-[#380957] text-xs font-black shrink-0 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#7e1db3]" />
                    <span>ເບິ່ງຮູບທັງໝົດໃນເພຈ PHEUKSA</span>
                  </a>
                </div>
              )}

              {/* Title & Body */}
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#240638] leading-snug">
                  {selectedNewsDetail.title}
                </h3>
                <div className="text-xs sm:text-sm text-[#644180] mt-3 leading-relaxed space-y-2 whitespace-pre-line">
                  {selectedNewsDetail.content || selectedNewsDetail.summary || selectedNewsDetail.excerpt}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-3">
                <a
                  href="#contestants"
                  onClick={() => setSelectedNewsDetail(null)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs btn-garden-vote flex items-center gap-1.5 shadow"
                >
                  <span>ຮ່ວມໂຫວດໃຫ້ນາງສາວໃນກິດຈະກຳນີ້</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedNewsDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                >
                  ປິດ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MISS KHMU STYLE OFFICIAL PAGEANT VOTING MODAL ==================== */}
      {votingContestant && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-amber-300/40 my-6">
            {/* Pageant Luxury Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 logo-exact-bg text-white border-b border-amber-400/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      costumeMode === "JEWELRY" && hasJewelryPhoto(votingContestant)
                        ? votingContestant.image_url
                        : (votingContestant.traditional_image_url || votingContestant.image_url)
                    }
                    alt={votingContestant.name}
                    onError={(e) => {
                      e.currentTarget.src = `/api/avatar?code=${votingContestant.code}&bg=garden&name=${encodeURIComponent(votingContestant.nickname)}`;
                    }}
                    className="w-12 h-12 rounded-xl object-cover object-top border-2 border-amber-300 shadow"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-amber-400 text-[#240638] font-black text-[9px]">
                    {votingContestant.code}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-200 font-bold">
                      Miss Hmong Vientiane 2027
                    </span>
                    <span className="text-[11px] text-white/80 font-medium hidden sm:inline">
                      • {votingContestant.province}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-base sm:text-lg">
                    {votingContestant.name} ({votingContestant.nickname})
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!voteReceipt && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-amber-200 font-bold border border-white/15">
                    <span>
                      {voteStep === 1
                        ? "ຂັ້ນຕອນ 1/2: ເລືອກແພັກເກັດ"
                        : "ຂັ້ນຕອນ 2/2: ຊຳລະ & ແນບໃບບິນ"}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setVotingContestant(null);
                    setVoteReceipt(null);
                  }}
                  className="p-2 rounded-xl bg-white/15 text-white hover:bg-white/25 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {voteReceipt ? (
              /* ==================== STAGE 3: OFFICIAL DIGITAL PAGEANT RECEIPT ==================== */
              <div className="p-6 sm:p-8 space-y-5 text-[#240638] bg-gradient-to-b from-white to-[#faf5ff]">
                {/* Pageant Official 3 Logos Header */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 pb-4 border-b border-amber-300/40">
                  <img
                    src="/logo_phouvong.png"
                    alt="Phouvong Jewelry"
                    className="h-9 sm:h-11 object-contain drop-shadow-sm"
                  />
                  <div className="h-7 w-px bg-amber-300/60" />
                  <img
                    src="/logo_mhvt.png"
                    alt="MHVT 2027"
                    className="h-10 sm:h-12 object-contain drop-shadow-sm"
                  />
                  <div className="h-7 w-px bg-amber-300/60" />
                  <img
                    src="/logo_lao_ethnic_garden.png"
                    alt="Lao Ethnic Garden"
                    className="h-9 sm:h-11 object-contain drop-shadow-sm"
                  />
                </div>

                {/* Official Status Stamp Banner */}
                <div className="text-center space-y-1.5">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-sm border ${
                      voteReceipt.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-900 border-amber-300"
                    }`}
                  >
                    {voteReceipt.status === "APPROVED" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>ອະນຸມັດແລ້ວ • APPROVED & RECORDED</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>ລໍຖ້າກວດສອບໃບບິນ • PENDING VERIFICATION</span>
                      </>
                    )}
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-[#240638] pt-1">
                    ໃບຢັ້ງຢືນການໂຫວດທາງການ (Official Vote Receipt)
                  </h4>
                  <p className="text-xs text-[#644180]">
                    {voteReceipt.status === "APPROVED"
                      ? "ຄະແນນໂຫວດຖືກເພີ່ມເຂົ້າສູ່ລະບົບຮຽບຮ້ອຍແລ້ວ! ຂອບໃຈທີ່ຮ່ວມເຊຍ ແລະ ສົ່ງແຮງໃຈໃຫ້ນາງສາວ"
                      : "ລະບົບໄດ້ຮັບໃບບິນໂອນເງິນຂອງທ່ານແລ້ວ ຄະນະກຳມະການກຳລັງກວດສອບ ແລະ ຈະອັບເດດຄະແນນໃຫ້ໄວທີ່ສຸດ"}
                  </p>
                </div>

                {/* Official Receipt Card Box */}
                <div className="bg-white border-2 border-[#9333ea]/20 rounded-2xl p-5 shadow-sm space-y-3.5 text-xs text-[#240638]">
                  {/* Contestant Highlight in Receipt */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f6effc] border border-[#9333ea]/20">
                    <img
                      src={
                        costumeMode === "JEWELRY" && hasJewelryPhoto(votingContestant)
                          ? votingContestant.image_url
                          : (votingContestant.traditional_image_url || votingContestant.image_url)
                      }
                      alt={votingContestant.name}
                      className="w-12 h-12 rounded-lg object-cover object-top border border-amber-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded logo-exact-bg text-white font-black text-[11px]">
                          {voteReceipt.contestant_code}
                        </span>
                        <span className="font-black text-sm text-[#240638]">
                          {voteReceipt.contestant_name}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#644180] mt-0.5">
                        ຜູ້ເຂົ້າປະກວດ Miss Hmong Vientiane 2027
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#644180] block">ຄະແນນທີ່ໂຫວດ</span>
                      <span className="text-base font-black text-[#520d7a]">
                        +{voteReceipt.points_added.toLocaleString()} Votes
                      </span>
                    </div>
                  </div>

                  {/* Transaction Key Details */}
                  <div className="divide-y divide-gray-100 space-y-2">
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ເລກອ້າງອີງທຸລະກຳ (Ref No.):</span>
                      <span className="font-mono font-bold text-[#520d7a]">
                        {voteReceipt.payment_ref}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ຍອດເງິນຊຳລະ (Amount):</span>
                      <span className="font-black text-sm text-[#240638]">
                        {formatPrice(voteReceipt.amount_lak)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ຊື່ຜູ້ໂຫວດ:</span>
                      <span className="font-bold">
                        {voteReceipt.voter_name || "ຜູ້ສະໜັບສະໜູນ ສວນບັນດາເຜົ່າ"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ວັນທີ & ເວລາ:</span>
                      <span className="font-mono text-[11px] text-[#644180]">
                        {voteReceipt.created_at}
                      </span>
                    </div>
                    {voteReceipt.cheer_message && (
                      <div className="pt-2">
                        <span className="text-[#644180] block mb-0.5">ຂໍ້ຄວາມເຊຍ:</span>
                        <p className="italic text-[#520d7a] bg-[#faf5ff] p-2 rounded-lg border border-[#e9d5ff]">
                          &ldquo;{voteReceipt.cheer_message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Uploaded Slip Confirmation Preview if available */}
                  {voteReceipt.slip_image_url && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-[#644180] block mb-1.5">
                        ຫຼັກຖານໃບບິນໂອນເງິນທີ່ແນບ (Attached Slip):
                      </span>
                      <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={voteReceipt.slip_image_url}
                          alt="Attached Slip"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Note & Actions */}
                <p className="text-[11px] text-center text-[#644180]">
                  💡 ທ່ານສາມາດແຄັບໜ້າຈໍໃບຮັບເງິນນີ້ໄວ້ເປັນຫຼັກຖານການໂຫວດໄດ້
                </p>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVotingContestant(null);
                      setVoteReceipt(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    ປິດໜ້າຕ່າງ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoteReceipt(null);
                      setVoteStep(1);
                      setSlipPreview(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black btn-garden-vote shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ໂຫວດເພີ່ມໃຫ້ນາງສາວອີກ</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 space-y-5 text-[#240638]">
                {voteStep === 1 ? (
                  /* ==================== STEP 1: CHOOSE PACKAGE ==================== */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-[#240638]">
                          1. ເລືອກແພັກເກັດຄະແນນໂຫວດ (Vote Packages)
                        </h4>
                        <p className="text-xs text-[#644180]">
                          ເລືອກແພັກເກັດທີ່ຕ້ອງການເພື່ອສົ່ງແຮງໃຈໃຫ້ {votingContestant.name}
                        </p>
                      </div>
                      <div className="inline-flex rounded-xl bg-gray-100 p-1 text-[11px] border border-gray-200">
                        {["LAK", "THB", "USD"].map((cur) => (
                          <button
                            key={cur}
                            type="button"
                            onClick={() => setCurrency(cur)}
                            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                              currency === cur
                                ? "bg-[#7e1db3] text-white shadow-xs"
                                : "text-gray-600 hover:text-black"
                            }`}
                          >
                            {cur}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Package Grid 4x2 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {packages.map((pkg, idx) => {
                        const isSelected = selectedPkg?.id === pkg.id;
                        const isPopular = pkg.points === 20;
                        const isVip = pkg.points === 2500 || pkg.points === 1100;
                        return (
                          <button
                            key={pkg.id || idx}
                            type="button"
                            onClick={() => setSelectedPkg(pkg)}
                            onDoubleClick={() => {
                              setSelectedPkg(pkg);
                              setVoteStep(2);
                            }}
                            className={`relative p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "bg-[#f5edfc] border-2 border-[#7e1db3] shadow-md ring-2 ring-[#7e1db3]/30 scale-[1.02]"
                                : "bg-white border-gray-200 hover:border-[#a855f7] hover:bg-gray-50/50"
                            }`}
                          >
                            {isSelected && (
                              <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black shadow">
                                ✓ ເລືອກແລ້ວ
                              </span>
                            )}
                            {isPopular && !isSelected && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#7e1db3] text-white text-[9px] font-black uppercase tracking-wider shadow">
                                ຍອດນິຍົມ
                              </span>
                            )}
                            {isVip && !isSelected && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-[#240638] text-[9px] font-black uppercase tracking-wider shadow">
                                VIP
                              </span>
                            )}
                            <div className="pt-1">
                              <div className="text-xl sm:text-2xl font-black text-[#240638]">
                                +{pkg.points.toLocaleString()}
                              </div>
                              <div className="text-[11px] font-bold text-[#644180]">
                                {pkg.points === 1 ? "Vote" : "Votes"}
                              </div>
                            </div>
                            <div className="text-xs font-black text-[#6b1699] mt-2 pt-2 border-t border-gray-100">
                              {formatPrice(pkg.price_lak)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Summary & Next Button */}
                    <div className="p-4 rounded-2xl bg-[#f6effc] border border-[#9333ea]/25 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                      <div>
                        <span className="text-xs text-[#644180] block">ແພັກເກັດທີ່ເລືອກ:</span>
                        <div className="text-sm font-black text-[#240638] flex items-center gap-2">
                          <span className="text-[#6b1699]">
                            +{selectedPkg?.points.toLocaleString()} Votes
                          </span>
                          <span>•</span>
                          <span>{selectedPkg ? formatPrice(selectedPkg.price_lak) : ""}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVoteStep(2)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs btn-garden-vote flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>ຕໍ່ໄປ: ຂັ້ນຕອນຊຳລະເງິນ & ແນບໃບບິນ</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ==================== STEP 2: BANK TRANSFER & SLIP UPLOAD ==================== */
                  <div className="space-y-4">
                    {/* Back to Step 1 Bar & Quick Package Switcher */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => setVoteStep(1)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b1699] hover:text-[#520d7a] cursor-pointer bg-[#f5edfc] hover:bg-[#ede0fa] px-3 py-1.5 rounded-xl border border-[#9333ea]/20 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>ປ່ຽນແພັກເກັດ</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#644180] hidden sm:inline">ແພັກເກັດ:</span>
                        <select
                          value={selectedPkg?.id || ""}
                          onChange={(e) => {
                            const pId = Number(e.target.value);
                            const found = packages.find((p) => p.id === pId);
                            if (found) setSelectedPkg(found);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#f3ebfa] text-[#520d7a] font-black text-xs border border-[#9333ea]/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40"
                        >
                          {packages.map((p) => (
                            <option key={p.id} value={p.id}>
                              +{p.points.toLocaleString()} Votes • {formatPrice(p.price_lak)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 2-Column Grid: Left Bank & QR / Right Slip & Voter Info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Left: Official Bank QR & Payment Info */}
                      <div className="md:col-span-5 bg-gradient-to-b from-gray-50 to-[#faf6fd] rounded-2xl p-4 border border-gray-200 text-center space-y-3">
                        {/* QR Display Card */}
                        <div className="bg-white border-2 border-[#9333ea]/25 rounded-2xl p-4 shadow-xs flex flex-col items-center">
                          <div className="text-[11px] font-black tracking-wider uppercase text-[#520d7a] mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Lao QR Code (ສະແກນໄດ້ທຸກທະນາຄານ)</span>
                          </div>
                          <div className="w-52 h-52 bg-white border-2 border-[#9333ea]/30 rounded-2xl p-2.5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-[#faf5ff]">
                            <img
                              src="/official_lao_qr.png"
                              alt="Official Lao QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="mt-3 text-center">
                            <div className="text-base font-black text-[#240638]">
                              ຍອດໂອນ: {selectedPkg ? formatPrice(selectedPkg.price_lak) : ""}
                            </div>
                            <span className="text-[11px] text-[#644180] font-bold block mt-0.5">
                              ຮອງຮັບ BCEL One, APB, LDB, JDB ແລະ ທຸກແອັບທະນາຄານ
                            </span>
                          </div>
                        </div>

                        {/* Transfer Note Info Card */}
                        <div className="bg-[#fcfaff] rounded-xl p-3 border border-[#9333ea]/20 text-center text-xs space-y-1">
                          <div className="text-[11px] text-[#644180] font-semibold">
                            ໝາຍເຫດເນື້ອໃນການໂອນ:{" "}
                            <span className="font-black logo-exact-bg text-white px-2 py-0.5 rounded text-xs ml-1">
                              ໂຫວດ {votingContestant.code}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">
                            (ບັນທຶກຮູບ QR ຫຼື ສະແກນຜ່ານແອັບທະນາຄານຂອງທ່ານເພື່ອຊຳລະເງິນ)
                          </p>
                        </div>
                      </div>

                      {/* Right: Slip Upload & Supporter Form */}
                      <div className="md:col-span-7 space-y-3.5">
                        {/* Slip Upload Zone */}
                        <div>
                          <label className="block text-xs text-[#240638] font-extrabold mb-1.5">
                            ແນບຮູບໃບບິນໂອນເງິນ (Bank Slip) <span className="text-red-500">*</span>
                          </label>

                          {slipPreview ? (
                            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 p-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={slipPreview}
                                  alt="Slip Preview"
                                  className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shadow-xs"
                                />
                                <div>
                                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    ແນບໃບບິນສຳເລັດແລ້ວ
                                  </span>
                                  <span className="text-[11px] text-gray-500 block">
                                    ຮູບໃບບິນພ້ອມສົ່ງໃຫ້ກວດສອບ
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <label className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs">
                                  ປ່ຽນຮູບ
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSlipUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setSlipPreview(null)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title="ລຶບຮູບ"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-[#a855f7]/40 hover:border-[#7e1db3] bg-[#faf6fe] hover:bg-[#f6effc] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                              <Upload className="w-6 h-6 text-[#7e1db3] group-hover:-translate-y-0.5 transition" />
                              <span className="text-xs font-bold text-[#240638] mt-1.5">
                                ກົດເພື່ອແນບຮູບໃບບິນໂອນເງິນ (Upload Slip)
                              </span>
                              <span className="text-[10px] text-[#644180] mt-0.5">
                                ຮອງຮັບຮູບໃບບິນ BCEL One / ທະນາຄານ (PNG, JPG, JPEG)
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleSlipUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        {/* Voter Name & Phone in 2 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-700 font-bold mb-1">
                              ຊື່ຜູ້ໂຫວດ / ທີມເຊຍ
                            </label>
                            <div className="relative">
                              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={voterName}
                                onChange={(e) => setVoterName(e.target.value)}
                                placeholder="ຊື່ຂອງທ່ານ (ຫຼື ປະຫວ່າງ)..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#240638] focus:bg-white focus:outline-none focus:border-[#7e1db3]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-700 font-bold mb-1">
                              ເບີໂທ / WhatsApp
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="tel"
                                value={voterPhone}
                                onChange={(e) => setVoterPhone(e.target.value)}
                                placeholder="020 xxxx xxxx"
                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#240638] focus:bg-white focus:outline-none focus:border-[#7e1db3]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Cheer message */}
                        <div>
                          <label className="block text-xs text-gray-700 font-bold mb-1">
                            ຄຳອວຍພອນ / ຂໍ້ຄວາມເຊຍ
                          </label>
                          <input
                            type="text"
                            value={cheerMessage}
                            onChange={(e) => setCheerMessage(e.target.value)}
                            placeholder="ຝາກຂໍ້ຄວາມສົ່ງແຮງໃຈ..."
                            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#240638] focus:bg-white focus:outline-none focus:border-[#7e1db3]"
                          />
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {CHEER_PRESETS.map((msg, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setCheerMessage(msg)}
                                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                                  cheerMessage === msg
                                    ? "bg-[#f3ebfa] border-[#7e1db3] text-[#520d7a] font-bold"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                {msg}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 space-y-2">
                          <button
                            type="button"
                            disabled={submittingVote}
                            onClick={handleVoteSubmit}
                            className="w-full py-3.5 px-5 rounded-xl font-black text-sm flex items-center justify-center gap-2 btn-garden-vote shadow-md cursor-pointer transition"
                          >
                            {submittingVote ? (
                              <span>ກຳລັງສົ່ງໃບບິນໂຫວດ...</span>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                  ຢືນຢັນການໂອນເງິນ & ສົ່ງໃບບິນ (+{selectedPkg?.points.toLocaleString()} Votes)
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PodiumCard({ contestant, rank, totalVotes, costumeMode = "TRADITIONAL", onVote }) {
  const pct =
    totalVotes > 0 ? ((contestant.total_votes / totalVotes) * 100).toFixed(1) : "0.0";
  const hasJewelry = hasJewelryPhoto(contestant);
  const isJewelry = costumeMode === "JEWELRY" && hasJewelry;
  const displayImg = isJewelry
    ? contestant.image_url
    : (contestant.traditional_image_url || contestant.image_url);

  const rankStyles = {
    1: {
      cardBg: "bg-white text-[#240638] border-4 border-amber-400 shadow-2xl",
      badgeBg: "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#240638]",
      label: "ອັນດັບ 1",
      orderClass: "lg:order-3 lg:-translate-y-4",
      ring: "border-amber-400",
      btnClass: "btn-gold-vote",
      icon: Crown,
    },
    2: {
      cardBg: "bg-white/95 text-[#240638] border-2 border-[#c084fc] shadow-xl",
      badgeBg: "logo-exact-bg text-white",
      label: "ອັນດັບ 2",
      orderClass: "lg:order-2 lg:-translate-y-1.5",
      ring: "border-[#a855f7]",
      btnClass: "btn-garden-vote",
      icon: Medal,
    },
    3: {
      cardBg: "bg-white/95 text-[#240638] border-2 border-fuchsia-400/70 shadow-xl",
      badgeBg: "bg-purple-800 text-white",
      label: "ອັນດັບ 3",
      orderClass: "lg:order-4 lg:-translate-y-1.5",
      ring: "border-fuchsia-500",
      btnClass: "btn-garden-vote",
      icon: Award,
    },
    4: {
      cardBg: "bg-white/95 text-[#240638] border-2 border-[#a855f7]/60 shadow-lg",
      badgeBg: "bg-[#520d7a] text-white",
      label: "ອັນດັບ 4",
      orderClass: "lg:order-1",
      ring: "border-[#9333ea]",
      btnClass: "btn-garden-vote",
      icon: Star,
    },
    5: {
      cardBg: "bg-white/95 text-[#240638] border-2 border-[#a855f7]/60 shadow-lg",
      badgeBg: "bg-[#520d7a] text-white",
      label: "ອັນດັບ 5",
      orderClass: "lg:order-5",
      ring: "border-[#9333ea]",
      btnClass: "btn-garden-vote",
      icon: Star,
    },
  }[rank];

  return (
    <div
      className={`rounded-3xl ${rankStyles.cardBg} p-4 flex flex-col items-center text-center relative transition hover:shadow-2xl ${rankStyles.orderClass}`}
    >
      <span
        className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black shadow ${rankStyles.badgeBg}`}
      >
        <span>{rankStyles.label}</span>
      </span>

      <div
        className={`relative w-full aspect-[3/4] max-w-[165px] rounded-2xl overflow-hidden mt-3 border-3 ${rankStyles.ring} shadow-md bg-[#35064f]`}
      >
        <img
          src={displayImg}
          alt={contestant.name}
          onError={(e) => {
            e.currentTarget.src = `/api/avatar?code=${contestant.code}&bg=garden&name=${encodeURIComponent(contestant.nickname)}`;
          }}
          className="w-full h-full object-cover object-top"
        />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow bg-black/75 text-amber-300 border border-amber-400/30">
          {isJewelry ? "ຊຸດປະດັບຄຳ" : "ຊຸດມົ້ງດັ້ງເດີມ"}
        </span>
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white text-[#240638] font-black text-[11px] shadow">
          {contestant.code}
        </span>
      </div>

      <h3 className="font-black text-[#240638] text-sm sm:text-base mt-3 line-clamp-1">
        {contestant.name}
      </h3>

      <div className="mt-2.5 w-full bg-[#f6effc] rounded-2xl py-2.5 px-2 border border-[#9333ea]/20">
        <div className="text-lg font-black text-[#520d7a]">
          {contestant.total_votes.toLocaleString()}{" "}
          <span className="text-[11px] font-bold text-[#9333ea]">Votes</span>
        </div>
        <div className="text-[10px] text-[#644180] font-semibold">
          ຄິດເປັນ {pct}% ຂອງຄະແນນລວມ
        </div>
      </div>

      <button
        onClick={onVote}
        className={`mt-3 w-full py-2.5 rounded-xl font-black text-xs ${rankStyles.btnClass} flex items-center justify-center gap-1 cursor-pointer`}
      >
        <span>ໂຫວດ {contestant.code}</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
