import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

interface OtpRecord {
  otp: string;
  expiresAt: number;
}

const otpStore = ((globalThis as unknown as { __ayurlexOtpStore?: Map<string, OtpRecord> }).__ayurlexOtpStore =
  (globalThis as unknown as { __ayurlexOtpStore?: Map<string, OtpRecord> }).__ayurlexOtpStore ||
  new Map<string, OtpRecord>());

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "_ayurlex_salt_2026").digest("hex");
}

function getRegistryFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), "..", "data", "users", "registry.json"),
    path.resolve(process.cwd(), "data", "users", "registry.json"),
    path.resolve("c:/project/ip_sakti1/data/users/registry.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  // If not yet existing, choose the one whose parent directory exists
  for (const p of candidates) {
    if (fs.existsSync(path.dirname(p))) {
      return p;
    }
  }
  return candidates[0];
}

function readUsersFromFile(): any[] {
  try {
    const filePath = getRegistryFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("[AYURLEX Auth] Error reading users:", err);
  }
  return [];
}

function writeUsersToFile(users: any[]) {
  try {
    const filePath = getRegistryFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("[AYURLEX Auth] Error writing users:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      username,
      email,
      password,
      confirmPassword,
      name,
      role = "citizen",
      otp,
      institution,
      registrationNumber,
      device,
    } = body;

    const users = readUsersFromFile();

    // ─────────────────────────────────────────────────────────────────────────
    // 1. ACTION: LOGIN (RETURNING USERS — SIGN IN WITH USERNAME & PASSWORD)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "login") {
      const loginIdentifier = (username || email || "").trim().toLowerCase();

      if (!loginIdentifier) {
        return NextResponse.json(
          { error: "Please enter your username." },
          { status: 400 }
        );
      }

      if (!password || !password.trim()) {
        return NextResponse.json(
          { error: "Please enter your password." },
          { status: 400 }
        );
      }

      // Find user by unique username (or fallback to email if legacy)
      const existingUserIndex = users.findIndex((u) => {
        const uName = (u.username || "").toLowerCase();
        const uEmail = (u.email || "").toLowerCase();
        return uName === loginIdentifier || uEmail === loginIdentifier;
      });

      if (existingUserIndex === -1) {
        return NextResponse.json(
          {
            error: "User does not exist in our database. Please click 'Create Account' to sign up.",
          },
          { status: 404 }
        );
      }

      const user = users[existingUserIndex];
      const submittedHash = hashPassword(password.trim());

      // Check password match
      if (user.passwordHash) {
        if (user.passwordHash !== submittedHash) {
          return NextResponse.json(
            { error: "Wrong password entered. Please check your password and try again." },
            { status: 401 }
          );
        }
      } else {
        // Seed user setup on first password attempt
        user.passwordHash = submittedHash;
      }

      const sessionToken = `AYUR-SESSION-0x${Math.floor(Math.random() * 16777215)
        .toString(16)
        .toUpperCase()}`;

      user.isLoggedIn = true;
      user.lastLogin = new Date().toISOString();
      user.lastActive = "Just now";
      if (device) user.device = device;

      writeUsersToFile(users);

      return NextResponse.json({
        success: true,
        message: "Welcome back! Login verified successfully.",
        sessionToken,
        user: {
          name: user.name,
          username: user.username || user.email.split("@")[0],
          email: user.email,
          role: user.role,
          institution: user.institution || "Ayurvedic Medical Community",
          registrationNumber: user.registrationNumber || "AYUR-VERIFIED",
          isLoggedIn: true,
          sessionToken,
          lastLogin: user.lastLogin,
        },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. ACTION: REGISTER (FIRST-TIME USERS — USERNAME + PASSWORD + OTP)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "register") {
      const normalizedUsername = (username || "").trim().toLowerCase();
      const normalizedEmail = (email || "").trim().toLowerCase();

      if (!normalizedUsername) {
        return NextResponse.json(
          { error: "Please enter a unique username." },
          { status: 400 }
        );
      }

      if (normalizedUsername.length < 3) {
        return NextResponse.json(
          { error: "Username must be at least 3 characters long." },
          { status: 400 }
        );
      }

      if (!/^[a-zA-Z0-9_.-]+$/.test(normalizedUsername)) {
        return NextResponse.json(
          { error: "Username can only contain letters, numbers, underscores, dashes, and periods." },
          { status: 400 }
        );
      }

      if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return NextResponse.json(
          { error: "Please provide a valid official or personal email address." },
          { status: 400 }
        );
      }

      // Check if username is already taken by another user
      const usernameTaken = users.some(
        (u) => (u.username || "").toLowerCase() === normalizedUsername && u.email.toLowerCase() !== normalizedEmail
      );
      if (usernameTaken) {
        return NextResponse.json(
          { error: "User name is already taken. Please choose another username." },
          { status: 400 }
        );
      }

      const existingUserIndex = users.findIndex(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      const finalName = (name || "").trim() || normalizedUsername;

      if (!password || password.trim().length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      if (password !== confirmPassword) {
        return NextResponse.json(
          { error: "Password and Confirm Password do not match." },
          { status: 400 }
        );
      }

      // Verify OTP for first-time account activation
      const enteredOtp = (otp || "").trim();
      if (!enteredOtp || enteredOtp.length !== 6) {
        return NextResponse.json(
          { error: "Please enter the 6-digit verification code sent to your email." },
          { status: 400 }
        );
      }

      const otpRecord = otpStore.get(normalizedEmail);
      const isOtpValid =
        otpRecord &&
        otpRecord.otp === enteredOtp &&
        Date.now() <= otpRecord.expiresAt;

      if (!isOtpValid) {
        return NextResponse.json(
          {
            error:
              "Invalid or expired OTP code. Please click 'Resend OTP' to receive a new code.",
          },
          { status: 400 }
        );
      }

      // Clear verified OTP
      otpStore.delete(normalizedEmail);

      const passwordHash = hashPassword(password.trim());
      const sessionToken = `AYUR-SESSION-0x${Math.floor(Math.random() * 16777215)
        .toString(16)
        .toUpperCase()}`;

      const nowIso = new Date().toISOString();

      if (existingUserIndex >= 0) {
        // Upgrade existing account
        users[existingUserIndex].username = normalizedUsername;
        users[existingUserIndex].name = finalName;
        users[existingUserIndex].role = role;
        users[existingUserIndex].passwordHash = passwordHash;
        users[existingUserIndex].institution = institution || users[existingUserIndex].institution || "Ayurvedic Medical Community";
        users[existingUserIndex].registrationNumber = registrationNumber || users[existingUserIndex].registrationNumber || "AYUR-VERIFIED";
        users[existingUserIndex].isLoggedIn = true;
        users[existingUserIndex].lastActive = "Just now";
        users[existingUserIndex].lastLogin = nowIso;
        if (device) users[existingUserIndex].device = device;
      } else {
        // Create brand new user
        users.unshift({
          username: normalizedUsername,
          email: normalizedEmail,
          name: finalName,
          role,
          passwordHash,
          institution: institution || "Ayurvedic Medical Community",
          registrationNumber: registrationNumber || "AYUR-VERIFIED",
          isLoggedIn: true,
          registeredAt: nowIso,
          lastActive: "Just now",
          lastLogin: nowIso,
          device: device || (req.headers.get("user-agent")?.includes("Mobile") ? "📱 Mobile (Phone)" : "💻 Desktop / Laptop"),
          sessions: [],
        });
      }

      writeUsersToFile(users);

      return NextResponse.json({
        success: true,
        message: "Account verified and registered successfully! Entering AYURLEX...",
        sessionToken,
        user: {
          name: finalName,
          username: normalizedUsername,
          email: normalizedEmail,
          role,
          institution: institution || "Ayurvedic Medical Community",
          registrationNumber: registrationNumber || "AYUR-VERIFIED",
          isLoggedIn: true,
          sessionToken,
          lastLogin: nowIso,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
  } catch (err) {
    console.error("[AYURLEX Auth API Error]:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
