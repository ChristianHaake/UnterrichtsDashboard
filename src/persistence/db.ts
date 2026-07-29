import Dexie, { type Table } from 'dexie'
import type { DashboardDocument } from './schema'

interface DocumentRow {
  key: string
  value: DashboardDocument
}

// Namespaced database name. A single active dashboard document is stored today;
// the keyed table leaves room for named dashboards later without a schema bump.
class UnterrichtsDashboardDB extends Dexie {
  documents!: Table<DocumentRow, string>

  constructor() {
    super('unterrichtsdashboard')
    this.version(1).stores({ documents: 'key' })
  }
}

const db = new UnterrichtsDashboardDB()
const ACTIVE_KEY = 'active'

export async function loadDocument(): Promise<DashboardDocument | null> {
  const row = await db.documents.get(ACTIVE_KEY)
  return row?.value ?? null
}

export async function saveDocument(doc: DashboardDocument): Promise<void> {
  await db.documents.put({ key: ACTIVE_KEY, value: doc })
}

export async function clearDocument(): Promise<void> {
  await db.documents.delete(ACTIVE_KEY)
}
