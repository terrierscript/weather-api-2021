import { NextApiHandler } from "next"
import { execute } from "../../lib/api"

const handler: NextApiHandler = async (req, res) => {
  const { lat, lon } = req.query
  if (!lat || !lon) {
    res.status(400).json({ message: "invalid parameter" })
    return
  }
  const result = await execute({ lat, lon })
  res.status(200).json(result)
}
export default handler
