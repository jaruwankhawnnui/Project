import { getSession } from 'next-auth/react'; // หรือใช้ฟังก์ชันอื่นที่เหมาะสมกับการจัดการ session ของคุณ

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(404).json({ error: "Unauthorized" });
  } else {
    res.status(200).json({ session });
  }
}
