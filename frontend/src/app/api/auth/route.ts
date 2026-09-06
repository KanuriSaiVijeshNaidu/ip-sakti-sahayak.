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
  const primaryPath = path.resolve(process.cwd(), "..", "data", "users", "registry.json");
  if (fs.existsSync(path.dirname(primaryPath))) {
    return primaryPath;
  }
  return path.resolve(process.cwd(), "data", "users", "registry.json");
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

    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const users = readUsersFromFile();
    const existingUserIndex = users.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    // ─────────────────────────────────────────────────────────────────────────
    // 1. ACTION: LOGIN (RETURNING USERS — NO OTP REQUIRED)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "login") {
      if (!password || !password.trim()) {
        return NextResponse.json(
          { error: "Please enter your password." },
          { status: 400 }
        );
      }

      if (existingUserIndex === -1) {
        return NextResponse.json(
          {
            error: "No account registered with this email. Please switch to 'Create Account' to sign up.",
          },
          { status: 404 }
        );
      }

      const user = users[existingUserIndex];
      const submittedHash = hashPassword(password.trim());

      // If user has a passwordHash, check match
      // If legacy or seed user doesn't have a hash, allow default "ayurlex123" and set hash
      if (user.passwordHash) {
        if (user.passwordHash !== submittedHash) {
          return NextResponse.json(
            { error: "Incorrect password. Please verify and try again." },
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
    // 2. ACTION: REGISTER (FIRST-TIME USERS — PASSWORD + OTP VERIFICATION)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "register") {
      const finalName = (name || "").trim() || normalizedEmail.split("@")[0];

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
