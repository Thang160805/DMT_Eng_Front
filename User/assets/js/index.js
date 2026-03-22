async function executeAuth() {
  const SDT = document.getElementById("loginPhone").value.trim();
  const Password = document.getElementById("loginPwd").value.trim();

  try {
    const response = await fetch("https://unchanneled-marcy-unnegotiated.ngrok-free.dev/user/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // 🔥 QUAN TRỌNG
      body: JSON.stringify({
        SDT,
        Password
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Đăng nhập thành công");

      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "home.html";
    } else {
      alert(data.message || "Sai số điện thoại hoặc mật khẩu");
    }
  } catch (error) {
    console.error(error);
    alert("Không kết nối được tới backend");
  }
}