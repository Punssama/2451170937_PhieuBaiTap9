# BÀI LÀM — PBT 09

## PHẦN A — KIỂM TRA ĐỌC HIỂU

### Câu A1 — DOM Tree

**DOM tree mô tả:**

- `#app`
  - `header`
  - `h1` → Todo App
  - `nav`
    - `a.active` → All
    - `a` → Active
    - `a` → Completed
  - `main`
  - `form#todoForm`
    - `input#todoInput`
    - `button[type="submit"]`
  - `ul#todoList`
    - `li.todo-item` → Learn HTML
    - `li.todo-item.completed` → Learn CSS

**querySelector:**

```javascript
document.querySelector("h1");
document.querySelector("#todoForm input");
document.querySelectorAll(".todo-item");
document.querySelector("nav a.active");
document.querySelector("#todoList li:first-child");
document.querySelectorAll("nav a");
```

---

### Câu A2 — innerHTML vs textContent

**Khác nhau:**

- `textContent`: lấy / gán nội dung text thuần, không parse HTML.
- `innerHTML`: lấy / gán HTML markup bên trong phần tử.

**Khi dùng:**

- Dùng `textContent` cho text an toàn, ví dụ hiển thị tên người dùng, thông báo.
- Dùng `innerHTML` khi cần render HTML có cấu trúc do chính mình tạo sẵn.

**XSS:**

- Nếu gán dữ liệu người dùng vào `innerHTML`, trình duyệt sẽ parse như HTML thật.
- Kẻ xấu có thể chèn script hoặc handler độc hại.

**Ví dụ sai:**

```javascript
const userInput = document.querySelector("#search").value;
document.querySelector("#result").innerHTML = userInput;
```

**Cách sửa:**

```javascript
document.querySelector("#result").textContent = userInput;
```

Nếu cần chèn HTML an toàn thì phải tự sanitize trước hoặc tạo node bằng `createElement`.

---

### Câu A3 — Event Bubbling

**Khi click button:**

```javascript
BUTTON;
INNER;
OUTER;
```

**Nếu bật `stopPropagation()`:**

```javascript
BUTTON;
```

**Giải thích:** sự kiện lan từ phần tử con ra ngoài theo cơ chế bubbling. `stopPropagation()` chặn không cho tiếp tục lan lên cha.

---

## PHẦN B — THỰC HÀNH CODE

### Bài B1 — Todo App hoàn chỉnh

- Folder: [todo_app](todo_app)

**Đã làm đủ:**

- Thêm todo bằng Enter hoặc nút Add.
- Xóa todo bằng nút ❌.
- Toggle completed bằng click vào text.
- Đếm số todo chưa hoàn thành.
- Lọc All / Active / Completed.
- Clear completed.
- Double-click để sửa todo.
- Lưu và tải lại bằng LocalStorage.

### Bài B2 — Interactive Product Catalog

- Folder: [product_catalog](product_catalog)

**Đã làm đủ:**

- Render sản phẩm hoàn toàn bằng JavaScript.
- Search realtime bằng event `input`.
- Filter theo category.
- Sort theo giá, tên, rating.
- Click card mở modal.
- Thêm giỏ cập nhật badge.
- Dark mode toggle.

### Bài B3 — Form Validator

- Folder: [form_validator](form_validator)

**Đã làm đủ:**

- Validate real-time cho tên, email, password, confirm password, phone.
- Có strength meter cho password.
- Tự format số điện thoại khi gõ.
- Nút submit disabled cho đến khi hợp lệ.
- Submit hiện modal thành công.

### Bài B4 — Keyboard Shortcuts & Accessibility

- Folder: [keyboard_app](keyboard_app)

**Đã làm đủ:**

- Gallery ảnh điều khiển bằng phím mũi tên, số, Space, Escape.
- Command palette mở bằng `Ctrl+K`.
- Có focus management và aria labels.

---

## PHẦN C — DEBUG & PHÂN TÍCH

### Câu C1 — Debug DOM Code

**Các lỗi chính:**

1. `addEventListener("onclick", ...)` sai event name.
   - Phải là `"click"`.

2. `countDisplay = count;` ở reset là gán lại biến DOM element.
   - Phải dùng `countDisplay.textContent = count`.

3. `historyList.innerHTML = null;` không đúng kiểu xóa.
   - Dùng `historyList.innerHTML = ""`.

4. `item.remove;` thiếu dấu ngoặc.
   - Phải là `item.remove()`.

5. `count = localStorage.getItem("count");` trả về string.
   - Cần ép sang number bằng `Number(...)`.

6. `deleteHistory(this)` được gọi trong function cổ điển, nhưng có thể viết gọn bằng `e.currentTarget`.

7. `historyList.append(li)` vẫn chạy nhưng nên nhất quán dùng `appendChild`.

8. Nên kiểm tra `countDisplay` và các nút có tồn tại trước khi bind.

**Hướng sửa:**

- Dùng đúng tên event.
- Phân biệt biến số và DOM node.
- Xử lý `localStorage` cẩn thận.
- Gọi `remove()` đúng cú pháp.

### Câu C2 — Performance

1. Bind event lên 1000 elements riêng lẻ là bad practice vì:

- Tốn bộ nhớ cho 1000 listener.
- Khó quản lý khi thêm/xóa phần tử động.
- Có thể làm chậm khởi tạo UI.

**Event Delegation** giải quyết bằng cách bind 1 listener ở cha, rồi kiểm tra `event.target` để xử lý cho con.

2. `DocumentFragment` nhanh hơn vì:

- Các node được tạo trong bộ nhớ tạm.
- Chỉ append một lần vào DOM thật.
- Giảm số lần reflow/repaint.

---

## Ghi chú

- Đã tạo đủ file theo checklist PBT 09.
- Có thể chạy trực tiếp từng app trong browser để chụp screenshots.
