const form = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const phoneInput = document.getElementById("phone");
const submitBtn = document.getElementById("submitBtn");
const strengthBar = document.getElementById("strengthBar");
const modal = document.getElementById("modal");
const summary = document.getElementById("summary");
const closeModal = document.getElementById("closeModal");

const nameMsg = document.getElementById("nameMSG");
const emailMsg = document.getElementById("emailMSG");
const passwordMsg = document.getElementById("passwordMSG");
const confirmMsg = document.getElementById("confirmMSG");
const phoneMsg = document.getElementById("phoneMSG");

function setStatus(input, messageEl, isValid, message = "") {
  input.classList.toggle("valid", isValid);
  input.classList.toggle("invalid", !isValid && input.value.length > 0);
  messageEl.textContent = message;
  return isValid;
}

function validateName() {
  const value = nameInput.value.trim();
  const valid = value.length >= 2 && value.length <= 50;
  return setStatus(
    nameInput,
    nameMsg,
    valid,
    valid || !value ? "" : "Tên phải từ 2 đến 50 ký tự.",
  );
}

function validateEmail() {
  const value = emailInput.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return setStatus(
    emailInput,
    emailMsg,
    valid,
    valid || !value ? "" : "Email không hợp lệ.",
  );
}

function getPasswordStrength(value) {
  if (value.length < 8)
    return {
      label: "Yếu",
      width: "33%",
      color: "#ef4444",
      valid: false,
      message: "Password phải có ít nhất 8 ký tự.",
    };
  const hasLetters = /[a-zA-Z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);
  if (hasLetters && hasNumbers && hasUpper && hasLower && hasSpecial) {
    return {
      label: "Mạnh",
      width: "100%",
      color: "#22c55e",
      valid: true,
      message: "Password mạnh.",
    };
  }
  if (hasLetters && hasNumbers) {
    return {
      label: "Trung bình",
      width: "66%",
      color: "#f59e0b",
      valid: true,
      message: "Password trung bình.",
    };
  }
  return {
    label: "Yếu",
    width: "33%",
    color: "#ef4444",
    valid: false,
    message: "Password yếu. Cần thêm chữ và số.",
  };
}

function validatePassword() {
  const value = passwordInput.value;
  const strength = getPasswordStrength(value);
  strengthBar.style.width = strength.width;
  strengthBar.style.background = strength.color;
  passwordMsg.textContent = `${strength.label}. ${strength.message}`;
  passwordInput.classList.toggle("valid", strength.valid);
  passwordInput.classList.toggle(
    "invalid",
    !strength.valid && value.length > 0,
  );
  return strength.valid;
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = [];
  if (digits.length <= 4) return digits;
  parts.push(digits.slice(0, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 10));
  return parts.join("-");
}

function validatePhone() {
  const digits = phoneInput.value.replace(/\D/g, "");
  const valid = /^\d{10}$/.test(digits);
  return setStatus(
    phoneInput,
    phoneMsg,
    valid,
    valid || !phoneInput.value ? "" : "Phone phải đủ 10 chữ số.",
  );
}

function validateConfirm() {
  const valid =
    confirmPasswordInput.value.length > 0 &&
    confirmPasswordInput.value === passwordInput.value;
  return setStatus(
    confirmPasswordInput,
    confirmMsg,
    valid,
    valid || !confirmPasswordInput.value ? "" : "Mật khẩu không khớp.",
  );
}

function updateSubmitState() {
  submitBtn.disabled = !(
    validateName() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirm() &&
    validatePhone()
  );
}

[
  nameInput,
  emailInput,
  passwordInput,
  confirmPasswordInput,
  phoneInput,
].forEach((input) => {
  input.addEventListener("input", () => {
    if (input === phoneInput) {
      const cursorAtEnd = phoneInput.selectionStart === phoneInput.value.length;
      phoneInput.value = formatPhone(phoneInput.value);
      if (cursorAtEnd)
        phoneInput.setSelectionRange(
          phoneInput.value.length,
          phoneInput.value.length,
        );
    }
    updateSubmitState();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateSubmitState();
  if (submitBtn.disabled) return;

  summary.textContent = [
    `Tên: ${nameInput.value.trim()}`,
    `Email: ${emailInput.value.trim()}`,
    `Phone: ${phoneInput.value}`,
  ].join("\n");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal.click();
});

updateSubmitState();
