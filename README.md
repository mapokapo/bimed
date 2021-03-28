[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![MIT License][license-shield]][license-url]
[![npm][npm-shield]][npm-url]

<br />
<p align="center">
  <a href="https://github.com/mapokapo/bimed">
    <img src="https://github.com/mapokapo/bimed/blob/master/images/logo.png" alt="Logo" width="175" height="64">
  </a>

  <h3 align="center">BIMED</h3>

  <p align="center">
    A binary image encoder/decoder
    <br />
    <a href="https://github.com/mapokapo/bimed/issues">Report Bug</a>
    ·
    <a href="https://github.com/mapokapo/bimed/issues">Request Feature</a>
  </p>
</p>

<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

### Built With

- [sharp](https://www.npmjs.com/package/sharp)
- [yargs](https://www.npmjs.com/package/yargs)
- [typescript](https://www.typescriptlang.org/)

## Getting Started

### Installation

1. Install NPM package
   ```sh
   npm install bimed
   ```

## Usage

You can use this package as a CLI tool: simply type `bimed --help` into your terminal to get started.

You can also include the package into your project and use the exported methods:

```javascript
const { encode, decode } = require("bimed").default;
// or
import { encode, decode } from "bimed";

const encoded = encode("1111000011000011", {
	width: 4,
	scale: 2,
	inverted: true,
});
const decoded = decode(encoded, { width: 4, scale: 2, inverted: true });
console.log(decoded); // "1111000011000011"
```

> **Note 1:** getting the encoded data using the CLI tool is not supported at this time. If you want to manipulate the raw encoded RGB bytes, use the exported methods in your project.

> **Note 2:** saving the encoded data to an image file is only possible using the CLI tool. If you want to manipulate the raw encoded RGB bytes before saving them to a file, use the exported methods in your project and then save the data to a file (must use raw encoding i.e. saving the raw bytes which represent pixel RGB data).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Leo Petrovic - leopetrovic11@gmail.com

Project Link: [https://github.com/mapokapo/bimed](https://github.com/mapokapo/bimed)

<!-- MARKDOWN LINKS & IMAGES -->

[forks-shield]: https://img.shields.io/github/forks/mapokapo/bimed.svg?style=for-the-badge
[forks-url]: https://github.com/mapokapo/bimed/network/members
[stars-shield]: https://img.shields.io/github/stars/mapokapo/bimed.svg?style=for-the-badge
[stars-url]: https://github.com/mapokapo/bimed/stargazers
[license-shield]: https://img.shields.io/github/license/mapokapo/bimed.svg?style=for-the-badge
[license-url]: https://github.com/mapokapo/bimed/blob/master/LICENSE
[npm-url]: https://www.npmjs.com/package/bimed
[npm-shield]: https://img.shields.io/npm/v/bimed?color=red&style=for-the-badge
