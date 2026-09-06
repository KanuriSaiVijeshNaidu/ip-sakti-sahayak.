import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface StoredUserRecord {
  email: string;
  name: string;
  role: string;
  institution?: string;
  registrationNumber?: string;
  isLoggedIn: boolean;
  registeredAt: string;
  lastActive: string;
  lastLogin: string;
  device?: string;
  sessions: Array<{
    id: string;
    title: string;
    domain: string;
    language: string;
    createdAt: number;
    updatedAt: number;
    messages: any[];
  }>;
}

// In-memory fallback cache across warm serverless invocations
const globalUserCache = ((globalThis as unknown as { __ayurlexUserRegistry?: Map<string, StoredUserRecord> }).__ayurlexUserRegistry =
  (globalThis as unknown as { __ayurlexUserRegistry?: Map<string, StoredUserRecord> }).__ayurlexUserRegistry ||
  new Map<string, StoredUserRecord>());

function getRegistryFilePath(): string {
  // Support both development (inside frontend/) and root workspace execution
  const primaryPath = path.resolve(process.cwd(), "..", "data", "users", "registry.json");
  if (fs.existsSync(path.dirname(primaryPath))) {
    return primaryPath;
  }
  const fallbackPath = path.resolve(process.cwd(), "data", "users", "registry.json");
  return fallbackPath;
}

function readUsersFromFile(): StoredUserRecord[] {
  try {
    const filePath = getRegistryFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("[AYURLEX UserRegistry] Error reading registry file:", err);
  }

  // If in-memory cache has records, return from cache
  if (globalUserCache.size > 0) {
    return Array.from(globalUserCache.values());
  }

  // Default seed users
  const defaultSeeds: StoredUserRecord[] = [
    {
      email: "saivijesh63@gmail.com",
      name: "K sai",
      role: "researcher",
      institution: "AYUSH Research & IP Defense Cell",
      registrationNumber: "AYUSH-RES-882",
      isLoggedIn: true,
      registeredAt: new Date(Date.now() - 86400000).toISOString(),
      lastActive: "Just now",
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      device: "💻 Desktop / Laptop",
      sessions: [
        {
          id: "session_demo_01",
          title: "Ashwagandha Synergy Patentability under Section 3(e)",
          domain: "patents",
          language: "en",
          createdAt: Date.now() - 3600000,
          updatedAt: Date.now() - 1800000,
          messages: [
            {
              id: "msg_1",
              role: "user",
              content: "Can I patent an Ayurvedic formulation with Ashwagandha?",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "msg_2",
              role: "assistant",
              content:
                "Under Section 3(p) of the Patents Act, 1970, traditional Ayurvedic knowledge is non-patentable. However, if synergism is experimentally proven (Combination Index CI < 1.0) per Section 3(e), synergistic processing methods may qualify for patent grants.",
              timestamp: new Date(Date.now() - 3590000).toISOString(),
              cited_passages: [
                {
                  section: "Section 3(p)",
                  source_title: "The Patents Act, 1970",
                  domain: "patents",
                  jurisdiction: "IN",
                  relevance_score: 0.94,
                  passage_text: "Inventions relating to traditional knowledge are excluded from patentability.",
                },
                {
                  section: "Section 3(e)",
                  source_title: "The Patents Act, 1970",
                  domain: "patents",
                  jurisdiction: "IN",
                  relevance_score: 0.91,
                  passage_text: "A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components is non-patentable.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      email: "vaidya.sharma@ayush.gov.in",
      name: "Dr. Rajesh Sharma, BAMS MD",
      role: "vaidya",
      institution: "National Institute of Ayurveda, Jaipur",
      registrationNumber: "AYUSH-DL-9842",
      isLoggedIn: true,
      registeredAt: new Date(Date.now() - 172800000).toISOString(),
      lastActive: "Today",
      lastLogin: new Date(Date.now() - 7200000).toISOString(),
      device: "📱 Mobile (Phone)",
      sessions: [
        {
          id: "session_demo_02",
          title: "Rule 158B Ayurvedic Proprietary Medicine Compliance",
          domain: "ayush",
          language: "en",
          createdAt: Date.now() - 7200000,
          updatedAt: Date.now() - 7100000,
          messages: [],
        },
      ],
    },
  ];

  writeUsersToFile(defaultSeeds);
  return defaultSeeds;
}

function writeUsersToFile(users: StoredUserRecord[]) {
  try {
    const filePath = getRegistryFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

    // Also sync in-memory cache
    globalUserCache.clear();
    for (const u of users) {
      globalUserCache.set(u.email.toLowerCase(), u);
    }
  } catch (err) {
    console.error("[AYURLEX UserRegistry] Error writing registry file:", err);
  }
}

// ── GET: Fetch all registered users for Admin Console ─────────────────────────
export async function GET() {
  const users = readUsersFromFile();
  return NextResponse.json({
    total_users: users.length,
    active_now: users.filter((u) => u.isLoggedIn).length,
    timestamp: new Date().toISOString(),
    users,
  });
}

// ── POST: Register new login, update profile, or sync session ─────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action = "register",
      email,
      name,
      role = "citizen",
      institution,
      registrationNumber,
      session,
      sessions,
      device,
    } = body;

    const normalizedEmail = (email || "").trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Valid email address is required to register user." },
        { status: 400 }
      );
    }

    const users = readUsersFromFile();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

    const nowIso = new Date().toISOString();
    const nowHuman = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", Today";

    if (action === "register" || action === "login") {
      if (existingIndex >= 0) {
        // Update existing user with fresh login timestamp and role
        users[existingIndex].name = name || users[existingIndex].name;
        users[existingIndex].role = role || users[existingIndex].role;
        users[existingIndex].institution = institution || users[existingIndex].institution;
        users[existingIndex].registrationNumber = registrationNumber || users[existingIndex].registrationNumber;
        users[existingIndex].isLoggedIn = true;
        users[existingIndex].lastActive = "Just now";
        users[existingIndex].lastLogin = nowIso;
        if (device) users[existingIndex].device = device;
        if (sessions && Array.isArray(sessions) && sessions.length > 0) {
          users[existingIndex].sessions = sessions;
        }
      } else {
        // Add new user entry
        const isMobile = req.headers.get("user-agent")?.includes("Mobile") || false;
        const newUser: StoredUserRecord = {
          email: normalizedEmail,
          name: name || normalizedEmail.split("@")[0],
          role: role || "citizen",
          institution: institution || "Ayurvedic Practitioner / Enterprise",
          registrationNumber: registrationNumber || "AYURLEX-VERIFIED",
          isLoggedIn: true,
          registeredAt: nowIso,
          lastActive: "Just now",
          lastLogin: nowIso,
          device: device || (isMobile ? "📱 Mobile (Phone)" : "💻 Desktop / Laptop"),
          sessions: sessions && Array.isArray(sessions) ? sessions : [],
        };
        users.unshift(newUser);
      }

      writeUsersToFile(users);

      return NextResponse.json({
        success: true,
        message: `User ${normalizedEmail} successfully registered in sovereign admin directory.`,
        userCount: users.length,
      });
    }

    if (action === "sync_session") {
      if (existingIndex >= 0) {
        users[existingIndex].lastActive = nowHuman;
        if (session) {
          const sessIndex = users[existingIndex].sessions.findIndex((s) => s.id === session.id);
          if (sessIndex >= 0) {
            users[existingIndex].sessions[sessIndex] = session;
          } else {
            users[existingIndex].sessions.unshift(session);
          }
        }
        if (sessions && Array.isArray(sessions)) {
          users[existingIndex].sessions = sessions;
        }
        writeUsersToFile(users);
        return NextResponse.json({ success: true, message: "Session synced to vault." });
      }
    }

    return NextResponse.json({ success: true, total: users.length });
  } catch (err) {
    console.error("[AYURLEX UserRegistry] POST error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
