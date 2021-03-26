[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<p align="center">
  <a href="https://github.com/mapokapo/bimed">
    <img src="https://github.com/mapokapo/bimed/blob/master/images/logo.png" alt="Logo" width="175" height="64">
  </a>

  <h3 align="center">BIMED</h3>

  <p align="center">
    A binary image encoder/decoder
    <br />
    <a href="https://github.com/mapokapo/bimed"><strong>Explore the docs »</strong></a>
    <br />
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
    <li><a href="#documentation">Documentation</a></li>
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
2. Use in your project
   ```javascript
   const { encode, decode } = require("bimed").default;
   // or
   import { encode, decode } from "bimed";
   ```

## Documentation

```javascript
const { encode, decode } = require("bimed").default;

const encoded = encode("1111000011000011");
const decoded = decode(encoded);

console.log(decoded); // "1111000011000011"
```

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

[contributors-shield]: https://img.shields.io/github/contributors/mapokapo/bimed.svg?style=for-the-badge
[contributors-url]: https://github.com/mapokapo/bimed/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mapokapo/bimed.svg?style=for-the-badge
[forks-url]: https://github.com/mapokapo/bimed/network/members
[stars-shield]: https://img.shields.io/github/stars/mapokapo/bimed.svg?style=for-the-badge
[stars-url]: https://github.com/mapokapo/bimed/stargazers
[issues-shield]: https://img.shields.io/github/issues/mapokapo/bimed.svg?style=for-the-badge
[issues-url]: https://github.com/mapokapo/bimed/issues
[license-shield]: https://img.shields.io/github/license/mapokapo/bimed.svg?style=for-the-badge
[license-url]: https://github.com/mapokapo/bimed/blob/master/LICENSE
