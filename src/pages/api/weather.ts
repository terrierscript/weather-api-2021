import { NextApiHandler } from "next"
import { execute } from "../../lib/api"

const handler: NextApiHandler = async (req, res) => {
  const { lat, lon } = req.query
  // const [lat, lon] = process.env.DARK_SKY_LATLNG.split(",")
  // console.log(lat, lon)
  if (!lat || !lon) {
    res.status(400).json({ message: "invalid parameter" })
    return
  }
  const result = await execute({ lat, lon })
  res.status(200).json(result)
}
export default handler
