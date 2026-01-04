import fs from "fs";

const FILE = "./data/tables.json";

export function getTables() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

export function setTableState(id, status) {
  const data = getTables();
  data[id] = status;
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
