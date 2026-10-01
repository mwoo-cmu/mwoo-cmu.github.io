HEADER = `<a href="#" class="header-brand">
            <img src="/jyuthokjyutlek/images/logo/jhjl.png" alt="越學粵叻" class="header-logo">
            <span class="header-title">越學粵叻</span>
        </a>
        <nav class="header-nav">
            <ul>
                <li><a href="#">Home / 主頁</a></li>
                <li><a href="#">Articles / 文章</a></li>
                <li><a href="#">About / 關於</a></li>
            </ul>
        </nav>`;

function generateHeader(variant) {
    document.getElementById("header").innerHTML = HEADER;
}