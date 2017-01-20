# HeaderViewExtention

# Description:

This browser extension evaluates a degree of trustworthiness and safety on every website you visit by inspecting the received HTTP headers and their compliance with the leading industry standards: a configured Content Security Policy (CSP), an absence of disclosed vulnerabilities for the current server version, etc. All HTTP headers (along with the redirects) are being recorded for the further examination in a convenient tabular form together with a grade (from A to F) of the security compliance.

The extension [is available for the download in Chrome Web Store](https://chrome.google.com/webstore/detail/header-view/gcaboclbghhfldnhffkbknldjhcogpog).

# Features:
1. [Displays list of HTTP headers in the response and their values.](https://github.com/Nidhognit/HeaderViewExtention/wiki/Displays-list-of-HTTP-headers-in-the-response-and-their-values.)
2. [If there were several requests, such as requests to the server made a redirect, you can see list of all requests.](https://github.com/Nidhognit/HeaderViewExtention/wiki/If-there-were-several-requests,-such-as-requests-to-the-server-made-a-redirect,-you-can-see-list-of-all-requests.)
3. [Extensions detects the presence of the security headers.](https://github.com/Nidhognit/HeaderViewExtention/wiki/Extensions-detects-the-presence-of-the-security-headers.)
4. [Determine the server and the technology used on the server.](https://github.com/Nidhognit/HeaderViewExtention/wiki/Determine-the-server-and-the-technology-used-on-the-server.)

# Building manually

1. Clone the repository.
2.
	* If you've got Node.js installed via [NVM](https://github.com/creationix/nvm), enter the project folder and run `nvm use` to automatically catch up to the latest stable Node version.
	* If the step above is not applicable in your case, just run `npm install` in the project folder using Node 7 or above.

3. Run `npm run build`. Everything should run succesfully and create `dist` folder with the extension content.
4. Enable [developer mode](https://developer.chrome.com/extensions/faq#faq-dev-01) for Google Chrome extensions.
5. Load `dist` folder as an extension in Google Chrome.

# Contributing

This section is to be done. Please advise with the maintainers directly if you are planning to make a pull request.