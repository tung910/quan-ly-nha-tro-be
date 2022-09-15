

import { Router } from "express";
import { create, get, list, remove, update } from "../controllers/motel.controller";

const router = Router();

router.get("/motels", list);

router.post("/motel",create);

router.get("/motels/:id", get);

router.delete("/motel/:id", remove);

router.put("/motel/:id", update);


export default router;
