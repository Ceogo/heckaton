export interface CitizenData {
  iin: string
  fullName: string
  address: string
  phone: string
  email: string
  requestsCount: number
}

const citizenDatabase: Record<string, CitizenData> = {
  "950101300123": {
    iin: "950101300123",
    fullName: "Нурбол Серикович Алиев",
    address: "мкр. Самал-2, дом 111, кв. 45",
    phone: "+7 777 123 4567",
    email: "nurbol.aliev@mail.kz",
    requestsCount: 3,
  },
  "880515400234": {
    iin: "880515400234",
    fullName: "Айгуль Кайратовна Касымова",
    address: "ул. Розыбакиева, дом 247, кв. 12",
    phone: "+7 701 234 5678",
    email: "aigul.kasymova@gmail.com",
    requestsCount: 1,
  },
  "920320500345": {
    iin: "920320500345",
    fullName: "Даурен Маратович Жумабаев",
    address: "мкр. Аксай-4, дом 89, кв. 78",
    phone: "+7 747 345 6789",
    email: "dauren.zhumabaev@inbox.ru",
    requestsCount: 5,
  },
  "000101200456": {
    iin: "000101200456",
    fullName: "Алия Бекзатовна Омарова",
    address: "мкр. Мамыр-1, дом 29, кв. 56",
    phone: "+7 775 456 7890",
    email: "aliya.omarova@mail.kz",
    requestsCount: 2,
  },
  "850707300567": {
    iin: "850707300567",
    fullName: "Ерлан Саматович Нуркенов",
    address: "ул. Масанчи, дом 98б, кв. 23",
    phone: "+7 702 567 8901",
    email: "erlan.nurkenov@gmail.com",
    requestsCount: 4,
  },
}

export function getCitizenData(iin: string): CitizenData {
  if (citizenDatabase[iin]) {
    return citizenDatabase[iin]
  }

  // Generate mock data for any IIN
  return {
    iin,
    fullName: "Гражданин Республики Казахстан",
    address: "Не указан",
    phone: "+7 700 000 0000",
    email: "citizen@mail.kz",
    requestsCount: 0,
  }
}
