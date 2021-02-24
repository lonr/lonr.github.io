# 给 GitHub Pages 添加域名

> 同时设置 Apex domain 和 Subdomain 后，只会为 Repo `Custom domain` 设置的域名生成证书，所以访问另一个域名会提示不安全。GitHub 正在解决这个问题~~来回更换 `Custom domain` 设置可以使两个证书短暂共存，但非设置中的那个 90 天后会失效~~

按照 GitHub 的[说明](https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site)：

1. 给 `www` subdomain 设置 `CNAME` 到 `<login>.github.io`
2. 给 `@` root 设置 A record 到 `185.199.108.153` 等（可以设置多个记录）
3. 在仓库设置设置 `Custom domain` 为 `www.example.com` 或者 `example.com`（等价于在 `/` 或 `/docs` 添加 `CNAME`文件）
4. 等待 DNS 生效，GitHub 生成 SSL 证书
5. 可选的，在仓库设置中开启 `Enforce HTTPS`

同时设置 `www` subdomain 和 `@` A record 时，另一个域名会跳转到 `Custom domain` 设置的域名。但 GitHub 只为 `Custom domain` 设置的域名生成证书，所以通过没有证书的那个域名访问会提示不安全。[见](https://github.community/t/apex-domain-issued-invalid-certificate-with-github-pages-custom-domain/150184/2)

我使用 Apex 域名（`lonr.dev`）作为 `Custom domain`，`.dev` 强制使用 HTTPS，所以删掉了 `www` 的 DNS。似乎可以通过 [Clouldflare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/) 解决。GitHub [已经着手解决这个问题了](https://github.com/isaacs/github/issues/1675#issuecomment-763051626)，等着好了。（那我吧 CNAME 加回来以后自动就能用了吧？）

另外 [ALIAS 是 A 的“别名”](https://support.dnsimple.com/articles/alias-record/#how-alias-records-work)可以对 Apex 域名使用 ALIAS 取代 4 个 A

- [Configuring a custom domain for your GitHub Pages site](https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Custom domain for GitHub pages](https://dev.to/aurangzaibdanial/custom-domain-for-github-pages-18a2)
- [How do I link my domain to GitHub Pages](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/)
- [GitHub Pages: Generate SSL certificate for www subdomain when a custom domain is set to an apex (and vice versa)](https://github.com/isaacs/github/issues/1675)
