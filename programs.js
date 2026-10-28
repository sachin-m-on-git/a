// Centralized database of all Cryptography / Network Security programs
const PROGRAMS_DATA = [
  {
    id: "1",
    title: "1. Caesar Cipher",
    aliases: ["1", "caesar", "caesar-cipher", "1.caesar"],
    code: `text = input("Enter text: ")
key = int(input("Enter key: "))
encrypted = ""
for ch in text:
    encrypted += chr((ord(ch) - 65 + key) % 26 + 65)
print("Encrypted:", encrypted)
decrypted = ""
for ch in encrypted:
    decrypted += chr((ord(ch) - 65 - key) % 26 + 65)
print("Decrypted:", decrypted)`
  },
  {
    id: "2",
    title: "2. GCD (Extended Euclidean)",
    aliases: ["2", "gcd", "extended-gcd", "2.gcd"],
    code: `def gcd_extended(a, b):
    if b == 0:
        return a, 1, 0
    gcd, x1, y1 = gcd_extended(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return gcd, x, y

a = int(input("Enter a: "))
b = int(input("Enter b: "))
gcd, x, y = gcd_extended(a, b)
print("GCD:", gcd)
print("x:", x)
print("y:", y)`
  },
  {
    id: "3",
    title: "3. XOR Operation",
    aliases: ["3", "xor", "xor-operation", "3.xor"],
    code: `message = input("Enter the message: ")
key = int(input("Enter the key: "))
encrypted = ""
for ch in message:
    encrypted += chr(ord(ch) ^ key)
print("Encrypted Text:", encrypted)
decrypted = ""
for ch in encrypted:
    decrypted += chr(ord(ch) ^ key)
print("Decrypted Text:", decrypted)`
  },
  {
    id: "4",
    title: "4. AES Encryption",
    aliases: ["4", "aes", "aes-encryption", "4.aes"],
    code: `from cryptography.fernet import Fernet
key = Fernet.generate_key()
cipher = Fernet(key)
text = input("Enter plaintext: ")
encrypted = cipher.encrypt(text.encode())
print("Encrypted:", encrypted.decode())
decrypted = cipher.decrypt(encrypted).decode()
print("Decrypted:", decrypted)`
  },
  {
    id: "5",
    title: "5. RSA",
    aliases: ["5", "rsa", "5.rsa"],
    code: `p = 17
q = 11
n = p * q
phi = (p - 1) * (q - 1)
e = 7
d = 1
while (d * e) % phi != 1:
    d += 1
print("Public Key:", (e, n))
print("Private Key:", (d, n))
message = int(input("Enter message (less than 187): "))
encrypted = pow(message, e, n)
print("Encrypted Message:", encrypted)
decrypted = pow(encrypted, d, n)
print("Decrypted Message:", decrypted)`
  },
  {
    id: "6",
    title: "6. Diffie-Hellman Key Exchange",
    aliases: ["6", "diffie", "diffie-hellman", "dh", "6.diffie"],
    code: `p = int(input("Enter prime number (P): "))
g = int(input("Enter primitive root (g): "))
a = int(input("Enter Alice's private key: "))
b = int(input("Enter Bob's private key: "))
A = pow(g, a, p)
B = pow(g, b, p)
key_A = pow(B, a, p)
key_B = pow(A, b, p)
print("Prime number (P):", p)
print("Primitive root (g):", g)
print("Alice's Private key:", a)
print("Bob's Private key:", b)
print("Alice's Public key:", A)
print("Bob's Public key:", B)
print("Alice's Shared Secret Key:", key_A)
print("Bob's Shared Secret Key:", key_B)
if key_A == key_B:
    print("Key Exchange Successful!")
else:
    print("Key Exchange Failed!")`
  },
  {
    id: "7",
    title: "7. SHA-256 Hash",
    aliases: ["7", "sha", "sha256", "sha-256", "7.sha"],
    code: `import hashlib
message = input("Enter the message: ")
hash_value = hashlib.sha256(message.encode()).hexdigest()
print("Original Message:", message)
print("SHA-256 Hash:", hash_value)`
  },
  {
    id: "8",
    title: "8. RSA Digital Signature",
    aliases: ["8", "rsa-sign", "signature", "digital-signature", "8.rsa"],
    code: `p = 17
q = 11
n = p * q
phi = (p-1) * (q-1)
e = 7
d = 23
message = int(input("Enter message: "))
signature = pow(message, d, n)
print("Signature:", signature)
verified = pow(signature, e, n)
print("Verified message:", verified)
if verified == message:
    print("Signature Verified")
else:
    print("Not Verified")`
  },
  {
    id: "9",
    title: "9. Password Authentication",
    aliases: ["9", "auth", "password", "password-auth", "9.auth"],
    code: `username = "admin"
password = "12345"
print("=== Password Authentication System ===")
user = input("Enter username: ")
pwd = input("Enter password: ")
if user == username and pwd == password:
    print("Login Successfully!")
    print("User Verified")
else:
    print("Login Failed!")
    print("Invalid Username or Password")`
  },
  {
    id: "10",
    title: "10. Firewall",
    aliases: ["10", "firewall", "fw", "10.firewall"],
    code: `allowed_ips = ["192.168.1.10", "192.168.1.20"]
blocked_ips = ["192.168.1.50", "10.0.0.5"]
ip = input("Enter IP Address: ")
if ip in blocked_ips:
    print("Access Denied - IP is blocked.")
elif ip in allowed_ips:
    print("Access Granted - IP is allowed.")
else:
    print("Access Denied - IP not found in firewall rules.")`
  }
];

// Helper to look up program by path or alias
function findProgramByRoute(route) {
  if (!route) return null;
  const clean = route.replace(/^\/+|\/+$/g, "").toLowerCase().trim();
  if (!clean) return null;

  for (const item of PROGRAMS_DATA) {
    if (item.id.toLowerCase() === clean) return item;
    if (item.aliases && item.aliases.some(a => a.toLowerCase() === clean)) return item;
  }
  return null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PROGRAMS_DATA, findProgramByRoute };
}
