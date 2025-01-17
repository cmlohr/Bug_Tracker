!(function () {
  function a(b) {
    if (!(this instanceof a)) return null == b ? new a() : new a(b);
    if ("function" == typeof b) return (this.random = b), this;
    arguments.length && (this.seed = 0);
    for (var c = 0; c < arguments.length; c++) {
      var d = 0;
      if ("[object String]" === Object.prototype.toString.call(arguments[c]))
        for (var e = 0; e < arguments[c].length; e++) {
          for (var f = 0, g = 0; g < arguments[c].length; g++)
            f = arguments[c].charCodeAt(g) + (f << 6) + (f << 16) - f;
          d += f;
        }
      else d = arguments[c];
      this.seed += (arguments.length - c) * d;
    }
    return (
      (this.mt = this.mersenne_twister(this.seed)),
      (this.bimd5 = this.blueimp_md5()),
      (this.random = function () {
        return this.mt.random(this.seed);
      }),
      this
    );
  }
  function b(a, b) {
    if ((a || (a = {}), b))
      for (var c in b) "undefined" == typeof a[c] && (a[c] = b[c]);
    return a;
  }
  function c(a, b) {
    if (a) throw new RangeError(b);
  }
  function d(a) {
    return function () {
      return this.natural(a);
    };
  }
  function e(a, b) {
    for (var c, d = r(a), e = 0, f = d.length; f > e; e++)
      (c = d[e]), (b[c] = a[c] || b[c]);
  }
  function f(a, b) {
    for (var c = 0, d = a.length; d > c; c++) b[c] = a[c];
  }
  function g(a, b) {
    var c = Array.isArray(a),
      d = b || (c ? new Array(a.length) : {});
    return c ? f(a, d) : e(a, d), d;
  }
  var h = 9007199254740992,
    i = -h,
    j = "0123456789",
    k = "abcdefghijklmnopqrstuvwxyz",
    l = k.toUpperCase(),
    m = j + "abcdef",
    n = Array.prototype.slice;
  a.prototype.VERSION = "1.0.4";
  var o = function () {
    throw new Error("No Base64 encoder available.");
  };
  !(function () {
    "function" == typeof btoa
      ? (o = btoa)
      : "function" == typeof Buffer &&
        (o = function (a) {
          return new Buffer(a).toString("base64");
        });
  })(),
    (a.prototype.bool = function (a) {
      return (
        (a = b(a, { likelihood: 50 })),
        c(
          a.likelihood < 0 || a.likelihood > 100,
          "Chance: Likelihood accepts values from 0 to 100."
        ),
        100 * this.random() < a.likelihood
      );
    }),
    (a.prototype.character = function (a) {
      (a = b(a)),
        c(
          a.alpha && a.symbols,
          "Chance: Cannot specify both alpha and symbols."
        );
      var d,
        e,
        f = "!@#$%^&*()[]";
      return (
        (d = "lower" === a.casing ? k : "upper" === a.casing ? l : k + l),
        (e = a.pool ? a.pool : a.alpha ? d : a.symbols ? f : d + j + f),
        e.charAt(this.natural({ max: e.length - 1 }))
      );
    }),
    (a.prototype.floating = function (a) {
      (a = b(a, { fixed: 4 })),
        c(
          a.fixed && a.precision,
          "Chance: Cannot specify both fixed and precision."
        );
      var d,
        e = Math.pow(10, a.fixed),
        f = h / e,
        g = -f;
      c(
        a.min && a.fixed && a.min < g,
        "Chance: Min specified is out of range with fixed. Min should be, at least, " +
          g
      ),
        c(
          a.max && a.fixed && a.max > f,
          "Chance: Max specified is out of range with fixed. Max should be, at most, " +
            f
        ),
        (a = b(a, { min: g, max: f })),
        (d = this.integer({ min: a.min * e, max: a.max * e }));
      var i = (d / e).toFixed(a.fixed);
      return parseFloat(i);
    }),
    (a.prototype.integer = function (a) {
      return (
        (a = b(a, { min: i, max: h })),
        c(a.min > a.max, "Chance: Min cannot be greater than Max."),
        Math.floor(this.random() * (a.max - a.min + 1) + a.min)
      );
    }),
    (a.prototype.natural = function (a) {
      return (
        (a = b(a, { min: 0, max: h })),
        c(a.min < 0, "Chance: Min cannot be less than zero."),
        this.integer(a)
      );
    }),
    (a.prototype.string = function (a) {
      (a = b(a, { length: this.natural({ min: 5, max: 20 }) })),
        c(a.length < 0, "Chance: Length cannot be less than zero.");
      var d = a.length,
        e = this.n(this.character, d, a);
      return e.join("");
    }),
    (a.prototype.capitalize = function (a) {
      return a.charAt(0).toUpperCase() + a.substr(1);
    }),
    (a.prototype.mixin = function (b) {
      for (var c in b) a.prototype[c] = b[c];
      return this;
    }),
    (a.prototype.unique = function (a, b, d) {
      c(
        "function" != typeof a,
        "Chance: The first argument must be a function."
      );
      var e = function (a, b) {
        return -1 !== a.indexOf(b);
      };
      d && (e = d.comparator || e);
      for (
        var f, g = [], h = 0, i = 50 * b, j = n.call(arguments, 2);
        g.length < b;

      ) {
        var k = JSON.parse(JSON.stringify(j));
        if (((f = a.apply(this, k)), e(g, f) || (g.push(f), (h = 0)), ++h > i))
          throw new RangeError(
            "Chance: num is likely too large for sample set"
          );
      }
      return g;
    }),
    (a.prototype.n = function (a, b) {
      c(
        "function" != typeof a,
        "Chance: The first argument must be a function."
      ),
        "undefined" == typeof b && (b = 1);
      var d = b,
        e = [],
        f = n.call(arguments, 2);
      for (d = Math.max(0, d), null; d--; null) e.push(a.apply(this, f));
      return e;
    }),
    (a.prototype.pad = function (a, b, c) {
      return (
        (c = c || "0"),
        (a += ""),
        a.length >= b ? a : new Array(b - a.length + 1).join(c) + a
      );
    }),
    (a.prototype.pick = function (a, b) {
      if (0 === a.length)
        throw new RangeError("Chance: Cannot pick() from an empty array");
      return b && 1 !== b
        ? this.shuffle(a).slice(0, b)
        : a[this.natural({ max: a.length - 1 })];
    }),
    (a.prototype.pickone = function (a) {
      if (0 === a.length)
        throw new RangeError("Chance: Cannot pickone() from an empty array");
      return a[this.natural({ max: a.length - 1 })];
    }),
    (a.prototype.pickset = function (a, b) {
      if (0 === b) return [];
      if (0 === a.length)
        throw new RangeError("Chance: Cannot pickset() from an empty array");
      if (0 > b) throw new RangeError("Chance: count must be positive number");
      return b && 1 !== b ? this.shuffle(a).slice(0, b) : [this.pickone(a)];
    }),
    (a.prototype.shuffle = function (a) {
      for (
        var b = a.slice(0), c = [], d = 0, e = Number(b.length), f = 0;
        e > f;
        f++
      )
        (d = this.natural({ max: b.length - 1 })),
          (c[f] = b[d]),
          b.splice(d, 1);
      return c;
    }),
    (a.prototype.weighted = function (a, b, c) {
      if (a.length !== b.length)
        throw new RangeError("Chance: length of array and weights must match");
      for (var d, e = 0, f = 0; f < b.length; ++f)
        (d = b[f]), d > 0 && (e += d);
      if (0 === e)
        throw new RangeError("Chance: no valid entries in array weights");
      var g,
        h = this.random() * e,
        i = 0,
        j = -1;
      for (f = 0; f < b.length; ++f) {
        if (((d = b[f]), (i += d), d > 0)) {
          if (i >= h) {
            g = f;
            break;
          }
          j = f;
        }
        f === b.length - 1 && (g = j);
      }
      var k = a[g];
      return (
        (c = "undefined" == typeof c ? !1 : c),
        c && (a.splice(g, 1), b.splice(g, 1)),
        k
      );
    }),
    (a.prototype.paragraph = function (a) {
      a = b(a);
      var c = a.sentences || this.natural({ min: 3, max: 7 }),
        d = this.n(this.sentence, c);
      return d.join(" ");
    }),
    (a.prototype.sentence = function (a) {
      a = b(a);
      var c,
        d = a.words || this.natural({ min: 12, max: 18 }),
        e = a.punctuation,
        f = this.n(this.word, d);
      return (
        (c = f.join(" ")),
        (c = this.capitalize(c)),
        e === !1 || /^[\.\?;!:]$/.test(e) || (e = "."),
        e && (c += e),
        c
      );
    }),
    (a.prototype.syllable = function (a) {
      a = b(a);
      for (
        var c,
          d = a.length || this.natural({ min: 2, max: 3 }),
          e = "bcdfghjklmnprstvwz",
          f = "aeiou",
          g = e + f,
          h = "",
          i = 0;
        d > i;
        i++
      )
        (c =
          0 === i
            ? this.character({ pool: g })
            : -1 === e.indexOf(c)
            ? this.character({ pool: e })
            : this.character({ pool: f })),
          (h += c);
      return a.capitalize && (h = this.capitalize(h)), h;
    }),
    (a.prototype.word = function (a) {
      (a = b(a)),
        c(
          a.syllables && a.length,
          "Chance: Cannot specify both syllables AND length."
        );
      var d = a.syllables || this.natural({ min: 1, max: 3 }),
        e = "";
      if (a.length) {
        do e += this.syllable();
        while (e.length < a.length);
        e = e.substring(0, a.length);
      } else for (var f = 0; d > f; f++) e += this.syllable();
      return a.capitalize && (e = this.capitalize(e)), e;
    }),
    (a.prototype.age = function (a) {
      a = b(a);
      var c;
      switch (a.type) {
        case "child":
          c = { min: 0, max: 12 };
          break;
        case "teen":
          c = { min: 13, max: 19 };
          break;
        case "adult":
          c = { min: 18, max: 65 };
          break;
        case "senior":
          c = { min: 65, max: 100 };
          break;
        case "all":
          c = { min: 0, max: 100 };
          break;
        default:
          c = { min: 18, max: 65 };
      }
      return this.natural(c);
    }),
    (a.prototype.birthday = function (a) {
      var c = this.age(a),
        d = new Date().getFullYear();
      if (a && a.type) {
        var e = new Date(),
          f = new Date();
        e.setFullYear(d - c - 1),
          f.setFullYear(d - c),
          (a = b(a, { min: e, max: f }));
      } else a = b(a, { year: d - c });
      return this.date(a);
    }),
    (a.prototype.cpf = function (a) {
      a = b(a, { formatted: !0 });
      var c = this.n(this.natural, 9, { max: 9 }),
        d =
          2 * c[8] +
          3 * c[7] +
          4 * c[6] +
          5 * c[5] +
          6 * c[4] +
          7 * c[3] +
          8 * c[2] +
          9 * c[1] +
          10 * c[0];
      (d = 11 - (d % 11)), d >= 10 && (d = 0);
      var e =
        2 * d +
        3 * c[8] +
        4 * c[7] +
        5 * c[6] +
        6 * c[5] +
        7 * c[4] +
        8 * c[3] +
        9 * c[2] +
        10 * c[1] +
        11 * c[0];
      (e = 11 - (e % 11)), e >= 10 && (e = 0);
      var f =
        "" +
        c[0] +
        c[1] +
        c[2] +
        "." +
        c[3] +
        c[4] +
        c[5] +
        "." +
        c[6] +
        c[7] +
        c[8] +
        "-" +
        d +
        e;
      return a.formatted ? f : f.replace(/\D/g, "");
    }),
    (a.prototype.cnpj = function (a) {
      a = b(a, { formatted: !0 });
      var c = this.n(this.natural, 12, { max: 12 }),
        d =
          2 * c[11] +
          3 * c[10] +
          4 * c[9] +
          5 * c[8] +
          6 * c[7] +
          7 * c[6] +
          8 * c[5] +
          9 * c[4] +
          2 * c[3] +
          3 * c[2] +
          4 * c[1] +
          5 * c[0];
      (d = 11 - (d % 11)), 2 > d && (d = 0);
      var e =
        2 * d +
        3 * c[11] +
        4 * c[10] +
        5 * c[9] +
        6 * c[8] +
        7 * c[7] +
        8 * c[6] +
        9 * c[5] +
        2 * c[4] +
        3 * c[3] +
        4 * c[2] +
        5 * c[1] +
        6 * c[0];
      (e = 11 - (e % 11)), 2 > e && (e = 0);
      var f =
        "" +
        c[0] +
        c[1] +
        "." +
        c[2] +
        c[3] +
        c[4] +
        "." +
        c[5] +
        c[6] +
        c[7] +
        "/" +
        c[8] +
        c[9] +
        c[10] +
        c[11] +
        "-" +
        d +
        e;
      return a.formatted ? f : f.replace(/\D/g, "");
    }),
    (a.prototype.first = function (a) {
      return (
        (a = b(a, { gender: this.gender(), nationality: "en" })),
        this.pick(
          this.get("firstNames")[a.gender.toLowerCase()][
            a.nationality.toLowerCase()
          ]
        )
      );
    }),
    (a.prototype.gender = function (a) {
      return (
        (a = b(a, { extraGenders: [] })),
        this.pick(["Male", "Female"].concat(a.extraGenders))
      );
    }),
    (a.prototype.last = function (a) {
      return (
        (a = b(a, { nationality: "en" })),
        this.pick(this.get("lastNames")[a.nationality.toLowerCase()])
      );
    }),
    (a.prototype.israelId = function () {
      for (
        var a = this.string({ pool: "0123456789", length: 8 }), b = 0, c = 0;
        c < a.length;
        c++
      ) {
        var d = a[c] * (c / 2 === parseInt(c / 2) ? 1 : 2);
        (d = this.pad(d, 2).toString()),
          (d = parseInt(d[0]) + parseInt(d[1])),
          (b += d);
      }
      return (a += (10 - parseInt(b.toString().slice(-1)))
        .toString()
        .slice(-1));
    }),
    (a.prototype.mrz = function (a) {
      var c = function (a) {
          var b = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(""),
            c = [7, 3, 1],
            d = 0;
          return (
            "string" != typeof a && (a = a.toString()),
            a.split("").forEach(function (a, e) {
              var f = b.indexOf(a);
              (a = -1 !== f ? (0 === f ? 0 : f + 9) : parseInt(a, 10)),
                (a *= c[e % c.length]),
                (d += a);
            }),
            d % 10
          );
        },
        d = function (a) {
          var b = function (a) {
              return new Array(a + 1).join("<");
            },
            d = [
              "P<",
              a.issuer,
              a.last.toUpperCase(),
              "<<",
              a.first.toUpperCase(),
              b(39 - (a.last.length + a.first.length + 2)),
              a.passportNumber,
              c(a.passportNumber),
              a.nationality,
              a.dob,
              c(a.dob),
              a.gender,
              a.expiry,
              c(a.expiry),
              b(14),
              c(b(14)),
            ].join("");
          return d + c(d.substr(44, 10) + d.substr(57, 7) + d.substr(65, 7));
        },
        e = this;
      return (
        (a = b(a, {
          first: this.first(),
          last: this.last(),
          passportNumber: this.integer({ min: 1e8, max: 999999999 }),
          dob: (function () {
            var a = e.birthday({ type: "adult" });
            return [
              a.getFullYear().toString().substr(2),
              e.pad(a.getMonth() + 1, 2),
              e.pad(a.getDate(), 2),
            ].join("");
          })(),
          expiry: (function () {
            var a = new Date();
            return [
              (a.getFullYear() + 5).toString().substr(2),
              e.pad(a.getMonth() + 1, 2),
              e.pad(a.getDate(), 2),
            ].join("");
          })(),
          gender: "Female" === this.gender() ? "F" : "M",
          issuer: "GBR",
          nationality: "GBR",
        })),
        d(a)
      );
    }),
    (a.prototype.name = function (a) {
      a = b(a);
      var c,
        d = this.first(a),
        e = this.last(a);
      return (
        (c = a.middle
          ? d + " " + this.first(a) + " " + e
          : a.middle_initial
          ? d + " " + this.character({ alpha: !0, casing: "upper" }) + ". " + e
          : d + " " + e),
        a.prefix && (c = this.prefix(a) + " " + c),
        a.suffix && (c = c + " " + this.suffix(a)),
        c
      );
    }),
    (a.prototype.name_prefixes = function (a) {
      (a = a || "all"), (a = a.toLowerCase());
      var b = [{ name: "Doctor", abbreviation: "Dr." }];
      return (
        ("male" === a || "all" === a) &&
          b.push({ name: "Mister", abbreviation: "Mr." }),
        ("female" === a || "all" === a) &&
          (b.push({ name: "Miss", abbreviation: "Miss" }),
          b.push({ name: "Misses", abbreviation: "Mrs." })),
        b
      );
    }),
    (a.prototype.prefix = function (a) {
      return this.name_prefix(a);
    }),
    (a.prototype.name_prefix = function (a) {
      return (
        (a = b(a, { gender: "all" })),
        a.full
          ? this.pick(this.name_prefixes(a.gender)).name
          : this.pick(this.name_prefixes(a.gender)).abbreviation
      );
    }),
    (a.prototype.HIDN = function () {
      var a = "0123456789",
        b = "ABCDEFGHIJKLMNOPQRSTUVWXYXZ",
        c = "";
      return (
        (c += this.string({ pool: a, length: 6 })),
        (c += this.string({ pool: b, length: 2 }))
      );
    }),
    (a.prototype.ssn = function (a) {
      a = b(a, { ssnFour: !1, dashes: !0 });
      var c,
        d = "1234567890",
        e = a.dashes ? "-" : "";
      return (c = a.ssnFour
        ? this.string({ pool: d, length: 4 })
        : this.string({ pool: d, length: 3 }) +
          e +
          this.string({ pool: d, length: 2 }) +
          e +
          this.string({ pool: d, length: 4 }));
    }),
    (a.prototype.name_suffixes = function () {
      var a = [
        { name: "Doctor of Osteopathic Medicine", abbreviation: "D.O." },
        { name: "Doctor of Philosophy", abbreviation: "Ph.D." },
        { name: "Esquire", abbreviation: "Esq." },
        { name: "Junior", abbreviation: "Jr." },
        { name: "Juris Doctor", abbreviation: "J.D." },
        { name: "Master of Arts", abbreviation: "M.A." },
        { name: "Master of Business Administration", abbreviation: "M.B.A." },
        { name: "Master of Science", abbreviation: "M.S." },
        { name: "Medical Doctor", abbreviation: "M.D." },
        { name: "Senior", abbreviation: "Sr." },
        { name: "The Third", abbreviation: "III" },
        { name: "The Fourth", abbreviation: "IV" },
        { name: "Bachelor of Engineering", abbreviation: "B.E" },
        { name: "Bachelor of Technology", abbreviation: "B.TECH" },
      ];
      return a;
    }),
    (a.prototype.suffix = function (a) {
      return this.name_suffix(a);
    }),
    (a.prototype.name_suffix = function (a) {
      return (
        (a = b(a)),
        a.full
          ? this.pick(this.name_suffixes()).name
          : this.pick(this.name_suffixes()).abbreviation
      );
    }),
    (a.prototype.nationalities = function () {
      return this.get("nationalities");
    }),
    (a.prototype.nationality = function () {
      var a = this.pick(this.nationalities());
      return a.name;
    }),
    (a.prototype.android_id = function () {
      return (
        "APA91" +
        this.string({
          pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_",
          length: 178,
        })
      );
    }),
    (a.prototype.apple_token = function () {
      return this.string({ pool: "abcdef1234567890", length: 64 });
    }),
    (a.prototype.wp8_anid2 = function () {
      return o(this.hash({ length: 32 }));
    }),
    (a.prototype.wp7_anid = function () {
      return (
        "A=" +
        this.guid().replace(/-/g, "").toUpperCase() +
        "&E=" +
        this.hash({ length: 3 }) +
        "&W=" +
        this.integer({ min: 0, max: 9 })
      );
    }),
    (a.prototype.bb_pin = function () {
      return this.hash({ length: 8 });
    }),
    (a.prototype.avatar = function (a) {
      var c = null,
        d = "//www.gravatar.com/avatar/",
        e = { http: "http", https: "https" },
        f = { bmp: "bmp", gif: "gif", jpg: "jpg", png: "png" },
        g = {
          404: "404",
          mm: "mm",
          identicon: "identicon",
          monsterid: "monsterid",
          wavatar: "wavatar",
          retro: "retro",
          blank: "blank",
        },
        h = { g: "g", pg: "pg", r: "r", x: "x" },
        i = {
          protocol: null,
          email: null,
          fileExtension: null,
          size: null,
          fallback: null,
          rating: null,
        };
      if (a)
        if ("string" == typeof a) (i.email = a), (a = {});
        else {
          if ("object" != typeof a) return null;
          if ("Array" === a.constructor) return null;
        }
      else (i.email = this.email()), (a = {});
      return (
        (i = b(a, i)),
        i.email || (i.email = this.email()),
        (i.protocol = e[i.protocol] ? i.protocol + ":" : ""),
        (i.size = parseInt(i.size, 0) ? i.size : ""),
        (i.rating = h[i.rating] ? i.rating : ""),
        (i.fallback = g[i.fallback] ? i.fallback : ""),
        (i.fileExtension = f[i.fileExtension] ? i.fileExtension : ""),
        (c =
          i.protocol +
          d +
          this.bimd5.md5(i.email) +
          (i.fileExtension ? "." + i.fileExtension : "") +
          (i.size || i.rating || i.fallback ? "?" : "") +
          (i.size ? "&s=" + i.size.toString() : "") +
          (i.rating ? "&r=" + i.rating : "") +
          (i.fallback ? "&d=" + i.fallback : ""))
      );
    }),
    (a.prototype.color = function (a) {
      function c(a, b) {
        return [a, a, a].join(b || "");
      }
      function d(a) {
        var b = a ? "rgba" : "rgb",
          d = a ? "," + this.floating({ min: 0, max: 1 }) : "",
          e = g
            ? c(this.natural({ max: 255 }), ",")
            : this.natural({ max: 255 }) +
              "," +
              this.natural({ max: 255 }) +
              "," +
              this.natural({ max: 255 });
        return b + "(" + e + d + ")";
      }
      function e(a, b, d) {
        var e = d ? "#" : "",
          f = g ? c(this.hash({ length: a })) : this.hash({ length: b });
        return e + f;
      }
      a = b(a, {
        format: this.pick(["hex", "shorthex", "rgb", "rgba", "0x", "name"]),
        grayscale: !1,
        casing: "lower",
      });
      var f,
        g = a.grayscale;
      if ("hex" === a.format) f = e.call(this, 2, 6, !0);
      else if ("shorthex" === a.format) f = e.call(this, 1, 3, !0);
      else if ("rgb" === a.format) f = d.call(this, !1);
      else if ("rgba" === a.format) f = d.call(this, !0);
      else {
        if ("0x" !== a.format) {
          if ("name" === a.format) return this.pick(this.get("colorNames"));
          throw new RangeError(
            'Invalid format provided. Please provide one of "hex", "shorthex", "rgb", "rgba", "0x" or "name".'
          );
        }
        f = "0x" + e.call(this, 2, 6);
      }
      return "upper" === a.casing && (f = f.toUpperCase()), f;
    }),
    (a.prototype.domain = function (a) {
      return (a = b(a)), this.word() + "." + (a.tld || this.tld());
    }),
    (a.prototype.email = function (a) {
      return (
        (a = b(a)),
        this.word({ length: a.length }) + "@" + (a.domain || this.domain())
      );
    }),
    (a.prototype.fbid = function () {
      return parseInt("10000" + this.natural({ max: 1e11 }), 10);
    }),
    (a.prototype.google_analytics = function () {
      var a = this.pad(this.natural({ max: 999999 }), 6),
        b = this.pad(this.natural({ max: 99 }), 2);
      return "UA-" + a + "-" + b;
    }),
    (a.prototype.hashtag = function () {
      return "#" + this.word();
    }),
    (a.prototype.ip = function () {
      return (
        this.natural({ min: 1, max: 254 }) +
        "." +
        this.natural({ max: 255 }) +
        "." +
        this.natural({ max: 255 }) +
        "." +
        this.natural({ min: 1, max: 254 })
      );
    }),
    (a.prototype.ipv6 = function () {
      var a = this.n(this.hash, 8, { length: 4 });
      return a.join(":");
    }),
    (a.prototype.klout = function () {
      return this.natural({ min: 1, max: 99 });
    }),
    (a.prototype.semver = function (a) {
      a = b(a, { include_prerelease: !0 });
      var c = this.pickone(["^", "~", "<", ">", "<=", ">=", "="]);
      a.range && (c = a.range);
      var d = "";
      return (
        a.include_prerelease &&
          (d = this.weighted(["", "-dev", "-beta", "-alpha"], [50, 10, 5, 1])),
        c + this.rpg("3d10").join(".") + d
      );
    }),
    (a.prototype.tlds = function () {
      return [
        "com",
        "org",
        "edu",
        "gov",
        "co.uk",
        "net",
        "io",
        "ac",
        "ad",
        "ae",
        "af",
        "ag",
        "ai",
        "al",
        "am",
        "an",
        "ao",
        "aq",
        "ar",
        "as",
        "at",
        "au",
        "aw",
        "ax",
        "az",
        "ba",
        "bb",
        "bd",
        "be",
        "bf",
        "bg",
        "bh",
        "bi",
        "bj",
        "bm",
        "bn",
        "bo",
        "bq",
        "br",
        "bs",
        "bt",
        "bv",
        "bw",
        "by",
        "bz",
        "ca",
        "cc",
        "cd",
        "cf",
        "cg",
        "ch",
        "ci",
        "ck",
        "cl",
        "cm",
        "cn",
        "co",
        "cr",
        "cu",
        "cv",
        "cw",
        "cx",
        "cy",
        "cz",
        "de",
        "dj",
        "dk",
        "dm",
        "do",
        "dz",
        "ec",
        "ee",
        "eg",
        "eh",
        "er",
        "es",
        "et",
        "eu",
        "fi",
        "fj",
        "fk",
        "fm",
        "fo",
        "fr",
        "ga",
        "gb",
        "gd",
        "ge",
        "gf",
        "gg",
        "gh",
        "gi",
        "gl",
        "gm",
        "gn",
        "gp",
        "gq",
        "gr",
        "gs",
        "gt",
        "gu",
        "gw",
        "gy",
        "hk",
        "hm",
        "hn",
        "hr",
        "ht",
        "hu",
        "id",
        "ie",
        "il",
        "im",
        "in",
        "io",
        "iq",
        "ir",
        "is",
        "it",
        "je",
        "jm",
        "jo",
        "jp",
        "ke",
        "kg",
        "kh",
        "ki",
        "km",
        "kn",
        "kp",
        "kr",
        "kw",
        "ky",
        "kz",
        "la",
        "lb",
        "lc",
        "li",
        "lk",
        "lr",
        "ls",
        "lt",
        "lu",
        "lv",
        "ly",
        "ma",
        "mc",
        "md",
        "me",
        "mg",
        "mh",
        "mk",
        "ml",
        "mm",
        "mn",
        "mo",
        "mp",
        "mq",
        "mr",
        "ms",
        "mt",
        "mu",
        "mv",
        "mw",
        "mx",
        "my",
        "mz",
        "na",
        "nc",
        "ne",
        "nf",
        "ng",
        "ni",
        "nl",
        "no",
        "np",
        "nr",
        "nu",
        "nz",
        "om",
        "pa",
        "pe",
        "pf",
        "pg",
        "ph",
        "pk",
        "pl",
        "pm",
        "pn",
        "pr",
        "ps",
        "pt",
        "pw",
        "py",
        "qa",
        "re",
        "ro",
        "rs",
        "ru",
        "rw",
        "sa",
        "sb",
        "sc",
        "sd",
        "se",
        "sg",
        "sh",
        "si",
        "sj",
        "sk",
        "sl",
        "sm",
        "sn",
        "so",
        "sr",
        "ss",
        "st",
        "su",
        "sv",
        "sx",
        "sy",
        "sz",
        "tc",
        "td",
        "tf",
        "tg",
        "th",
        "tj",
        "tk",
        "tl",
        "tm",
        "tn",
        "to",
        "tp",
        "tr",
        "tt",
        "tv",
        "tw",
        "tz",
        "ua",
        "ug",
        "uk",
        "us",
        "uy",
        "uz",
        "va",
        "vc",
        "ve",
        "vg",
        "vi",
        "vn",
        "vu",
        "wf",
        "ws",
        "ye",
        "yt",
        "za",
        "zm",
        "zw",
      ];
    }),
    (a.prototype.tld = function () {
      return this.pick(this.tlds());
    }),
    (a.prototype.twitter = function () {
      return "@" + this.word();
    }),
    (a.prototype.url = function (a) {
      a = b(a, {
        protocol: "http",
        domain: this.domain(a),
        domain_prefix: "",
        path: this.word(),
        extensions: [],
      });
      var c = a.extensions.length > 0 ? "." + this.pick(a.extensions) : "",
        d = a.domain_prefix ? a.domain_prefix + "." + a.domain : a.domain;
      return a.protocol + "://" + d + "/" + a.path + c;
    }),
    (a.prototype.port = function () {
      return this.integer({ min: 0, max: 65535 });
    }),
    (a.prototype.address = function (a) {
      return (
        (a = b(a)), this.natural({ min: 5, max: 2e3 }) + " " + this.street(a)
      );
    }),
    (a.prototype.altitude = function (a) {
      return (
        (a = b(a, { fixed: 5, min: 0, max: 8848 })),
        this.floating({ min: a.min, max: a.max, fixed: a.fixed })
      );
    }),
    (a.prototype.areacode = function (a) {
      a = b(a, { parens: !0 });
      var c =
        this.natural({ min: 2, max: 9 }).toString() +
        this.natural({ min: 0, max: 8 }).toString() +
        this.natural({ min: 0, max: 9 }).toString();
      return a.parens ? "(" + c + ")" : c;
    }),
    (a.prototype.city = function () {
      return this.capitalize(this.word({ syllables: 3 }));
    }),
    (a.prototype.coordinates = function (a) {
      return this.latitude(a) + ", " + this.longitude(a);
    }),
    (a.prototype.countries = function () {
      return this.get("countries");
    }),
    (a.prototype.country = function (a) {
      a = b(a);
      var c = this.pick(this.countries());
      return a.full ? c.name : c.abbreviation;
    }),
    (a.prototype.depth = function (a) {
      return (
        (a = b(a, { fixed: 5, min: -10994, max: 0 })),
        this.floating({ min: a.min, max: a.max, fixed: a.fixed })
      );
    }),
    (a.prototype.geohash = function (a) {
      return (
        (a = b(a, { length: 7 })),
        this.string({
          length: a.length,
          pool: "0123456789bcdefghjkmnpqrstuvwxyz",
        })
      );
    }),
    (a.prototype.geojson = function (a) {
      return (
        this.latitude(a) + ", " + this.longitude(a) + ", " + this.altitude(a)
      );
    }),
    (a.prototype.latitude = function (a) {
      return (
        (a = b(a, { fixed: 5, min: -90, max: 90 })),
        this.floating({ min: a.min, max: a.max, fixed: a.fixed })
      );
    }),
    (a.prototype.longitude = function (a) {
      return (
        (a = b(a, { fixed: 5, min: -180, max: 180 })),
        this.floating({ min: a.min, max: a.max, fixed: a.fixed })
      );
    }),
    (a.prototype.phone = function (a) {
      var c,
        d = this,
        e = function (a) {
          var b = [];
          return (
            a.sections.forEach(function (a) {
              b.push(d.string({ pool: "0123456789", length: a }));
            }),
            a.area + b.join(" ")
          );
        };
      (a = b(a, { formatted: !0, country: "us", mobile: !1 })),
        a.formatted || (a.parens = !1);
      var f;
      switch (a.country) {
        case "fr":
          a.mobile
            ? ((c =
                this.pick(["06", "07"]) +
                d.string({ pool: "0123456789", length: 8 })),
              (f = a.formatted ? c.match(/../g).join(" ") : c))
            : ((c = this.pick([
                "01" +
                  this.pick([
                    "30",
                    "34",
                    "39",
                    "40",
                    "41",
                    "42",
                    "43",
                    "44",
                    "45",
                    "46",
                    "47",
                    "48",
                    "49",
                    "53",
                    "55",
                    "56",
                    "58",
                    "60",
                    "64",
                    "69",
                    "70",
                    "72",
                    "73",
                    "74",
                    "75",
                    "76",
                    "77",
                    "78",
                    "79",
                    "80",
                    "81",
                    "82",
                    "83",
                  ]) +
                  d.string({ pool: "0123456789", length: 6 }),
                "02" +
                  this.pick([
                    "14",
                    "18",
                    "22",
                    "23",
                    "28",
                    "29",
                    "30",
                    "31",
                    "32",
                    "33",
                    "34",
                    "35",
                    "36",
                    "37",
                    "38",
                    "40",
                    "41",
                    "43",
                    "44",
                    "45",
                    "46",
                    "47",
                    "48",
                    "49",
                    "50",
                    "51",
                    "52",
                    "53",
                    "54",
                    "56",
                    "57",
                    "61",
                    "62",
                    "69",
                    "72",
                    "76",
                    "77",
                    "78",
                    "85",
                    "90",
                    "96",
                    "97",
                    "98",
                    "99",
                  ]) +
                  d.string({ pool: "0123456789", length: 6 }),
                "03" +
                  this.pick([
                    "10",
                    "20",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "26",
                    "27",
                    "28",
                    "29",
                    "39",
                    "44",
                    "45",
                    "51",
                    "52",
                    "54",
                    "55",
                    "57",
                    "58",
                    "59",
                    "60",
                    "61",
                    "62",
                    "63",
                    "64",
                    "65",
                    "66",
                    "67",
                    "68",
                    "69",
                    "70",
                    "71",
                    "72",
                    "73",
                    "80",
                    "81",
                    "82",
                    "83",
                    "84",
                    "85",
                    "86",
                    "87",
                    "88",
                    "89",
                    "90",
                  ]) +
                  d.string({ pool: "0123456789", length: 6 }),
                "04" +
                  this.pick([
                    "11",
                    "13",
                    "15",
                    "20",
                    "22",
                    "26",
                    "27",
                    "30",
                    "32",
                    "34",
                    "37",
                    "42",
                    "43",
                    "44",
                    "50",
                    "56",
                    "57",
                    "63",
                    "66",
                    "67",
                    "68",
                    "69",
                    "70",
                    "71",
                    "72",
                    "73",
                    "74",
                    "75",
                    "76",
                    "77",
                    "78",
                    "79",
                    "80",
                    "81",
                    "82",
                    "83",
                    "84",
                    "85",
                    "86",
                    "88",
                    "89",
                    "90",
                    "91",
                    "92",
                    "93",
                    "94",
                    "95",
                    "97",
                    "98",
                  ]) +
                  d.string({ pool: "0123456789", length: 6 }),
                "05" +
                  this.pick([
                    "08",
                    "16",
                    "17",
                    "19",
                    "24",
                    "31",
                    "32",
                    "33",
                    "34",
                    "35",
                    "40",
                    "45",
                    "46",
                    "47",
                    "49",
                    "53",
                    "55",
                    "56",
                    "57",
                    "58",
                    "59",
                    "61",
                    "62",
                    "63",
                    "64",
                    "65",
                    "67",
                    "79",
                    "81",
                    "82",
                    "86",
                    "87",
                    "90",
                    "94",
                  ]) +
                  d.string({ pool: "0123456789", length: 6 }),
                "09" + d.string({ pool: "0123456789", length: 8 }),
              ])),
              (f = a.formatted ? c.match(/../g).join(" ") : c));
          break;
        case "uk":
          a.mobile
            ? ((c = this.pick([
                {
                  area: "07" + this.pick(["4", "5", "7", "8", "9"]),
                  sections: [2, 6],
                },
                { area: "07624 ", sections: [6] },
              ])),
              (f = a.formatted ? e(c) : e(c).replace(" ", "")))
            : ((c = this.pick([
                {
                  area: "01" + this.character({ pool: "234569" }) + "1 ",
                  sections: [3, 4],
                },
                {
                  area: "020 " + this.character({ pool: "378" }),
                  sections: [3, 4],
                },
                {
                  area: "023 " + this.character({ pool: "89" }),
                  sections: [3, 4],
                },
                { area: "024 7", sections: [3, 4] },
                {
                  area:
                    "028 " +
                    this.pick(["25", "28", "37", "71", "82", "90", "92", "95"]),
                  sections: [2, 4],
                },
                {
                  area:
                    "012" +
                    this.pick(["04", "08", "54", "76", "97", "98"]) +
                    " ",
                  sections: [6],
                },
                {
                  area: "013" + this.pick(["63", "64", "84", "86"]) + " ",
                  sections: [6],
                },
                {
                  area:
                    "014" +
                    this.pick(["04", "20", "60", "61", "80", "88"]) +
                    " ",
                  sections: [6],
                },
                {
                  area: "015" + this.pick(["24", "27", "62", "66"]) + " ",
                  sections: [6],
                },
                {
                  area:
                    "016" +
                    this.pick(["06", "29", "35", "47", "59", "95"]) +
                    " ",
                  sections: [6],
                },
                {
                  area: "017" + this.pick(["26", "44", "50", "68"]) + " ",
                  sections: [6],
                },
                {
                  area: "018" + this.pick(["27", "37", "84", "97"]) + " ",
                  sections: [6],
                },
                {
                  area:
                    "019" +
                    this.pick(["00", "05", "35", "46", "49", "63", "95"]) +
                    " ",
                  sections: [6],
                },
              ])),
              (f = a.formatted ? e(c) : e(c).replace(" ", "", "g")));
          break;
        case "us":
          var g = this.areacode(a).toString(),
            h =
              this.natural({ min: 2, max: 9 }).toString() +
              this.natural({ min: 0, max: 9 }).toString() +
              this.natural({ min: 0, max: 9 }).toString(),
            i = this.natural({ min: 1e3, max: 9999 }).toString();
          f = a.formatted ? g + " " + h + "-" + i : g + h + i;
      }
      return f;
    }),
    (a.prototype.postal = function () {
      var a = this.character({ pool: "XVTSRPNKLMHJGECBA" }),
        b =
          a +
          this.natural({ max: 9 }) +
          this.character({ alpha: !0, casing: "upper" }),
        c =
          this.natural({ max: 9 }) +
          this.character({ alpha: !0, casing: "upper" }) +
          this.natural({ max: 9 });
      return b + " " + c;
    }),
    (a.prototype.counties = function (a) {
      return (
        (a = b(a, { country: "uk" })),
        this.get("counties")[a.country.toLowerCase()]
      );
    }),
    (a.prototype.county = function (a) {
      return this.pick(this.counties(a)).name;
    }),
    (a.prototype.provinces = function (a) {
      return (
        (a = b(a, { country: "ca" })),
        this.get("provinces")[a.country.toLowerCase()]
      );
    }),
    (a.prototype.province = function (a) {
      return a && a.full
        ? this.pick(this.provinces(a)).name
        : this.pick(this.provinces(a)).abbreviation;
    }),
    (a.prototype.state = function (a) {
      return a && a.full
        ? this.pick(this.states(a)).name
        : this.pick(this.states(a)).abbreviation;
    }),
    (a.prototype.states = function (a) {
      a = b(a, { country: "us", us_states_and_dc: !0 });
      var c;
      switch (a.country.toLowerCase()) {
        case "us":
          var d = this.get("us_states_and_dc"),
            e = this.get("territories"),
            f = this.get("armed_forces");
          (c = []),
            a.us_states_and_dc && (c = c.concat(d)),
            a.territories && (c = c.concat(e)),
            a.armed_forces && (c = c.concat(f));
          break;
        case "it":
          c = this.get("country_regions")[a.country.toLowerCase()];
          break;
        case "uk":
          c = this.get("counties")[a.country.toLowerCase()];
      }
      return c;
    }),
    (a.prototype.street = function (a) {
      a = b(a, { country: "us", syllables: 2 });
      var c;
      switch (a.country.toLowerCase()) {
        case "us":
          (c = this.word({ syllables: a.syllables })),
            (c = this.capitalize(c)),
            (c += " "),
            (c += a.short_suffix
              ? this.street_suffix(a).abbreviation
              : this.street_suffix(a).name);
          break;
        case "it":
          (c = this.word({ syllables: a.syllables })),
            (c = this.capitalize(c)),
            (c =
              (a.short_suffix
                ? this.street_suffix(a).abbreviation
                : this.street_suffix(a).name) +
              " " +
              c);
      }
      return c;
    }),
    (a.prototype.street_suffix = function (a) {
      return (a = b(a, { country: "us" })), this.pick(this.street_suffixes(a));
    }),
    (a.prototype.street_suffixes = function (a) {
      return (
        (a = b(a, { country: "us" })),
        this.get("street_suffixes")[a.country.toLowerCase()]
      );
    }),
    (a.prototype.zip = function (a) {
      var b = this.n(this.natural, 5, { max: 9 });
      return (
        a &&
          a.plusfour === !0 &&
          (b.push("-"), (b = b.concat(this.n(this.natural, 4, { max: 9 })))),
        b.join("")
      );
    }),
    (a.prototype.ampm = function () {
      return this.bool() ? "am" : "pm";
    }),
    (a.prototype.date = function (a) {
      var c, d;
      if (a && (a.min || a.max)) {
        a = b(a, { american: !0, string: !1 });
        var e = "undefined" != typeof a.min ? a.min.getTime() : 1,
          f = "undefined" != typeof a.max ? a.max.getTime() : 864e13;
        d = new Date(this.integer({ min: e, max: f }));
      } else {
        var g = this.month({ raw: !0 }),
          h = g.days;
        a &&
          a.month &&
          (h = this.get("months")[((a.month % 12) + 12) % 12].days),
          (a = b(a, {
            year: parseInt(this.year(), 10),
            month: g.numeric - 1,
            day: this.natural({ min: 1, max: h }),
            hour: this.hour({ twentyfour: !0 }),
            minute: this.minute(),
            second: this.second(),
            millisecond: this.millisecond(),
            american: !0,
            string: !1,
          })),
          (d = new Date(
            a.year,
            a.month,
            a.day,
            a.hour,
            a.minute,
            a.second,
            a.millisecond
          ));
      }
      return (
        (c = a.american
          ? d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()
          : d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()),
        a.string ? c : d
      );
    }),
    (a.prototype.hammertime = function (a) {
      return this.date(a).getTime();
    }),
    (a.prototype.hour = function (a) {
      return (
        (a = b(a, {
          min: a && a.twentyfour ? 0 : 1,
          max: a && a.twentyfour ? 23 : 12,
        })),
        c(a.min < 0, "Chance: Min cannot be less than 0."),
        c(
          a.twentyfour && a.max > 23,
          "Chance: Max cannot be greater than 23 for twentyfour option."
        ),
        c(
          !a.twentyfour && a.max > 12,
          "Chance: Max cannot be greater than 12."
        ),
        c(a.min > a.max, "Chance: Min cannot be greater than Max."),
        this.natural({ min: a.min, max: a.max })
      );
    }),
    (a.prototype.millisecond = function () {
      return this.natural({ max: 999 });
    }),
    (a.prototype.minute = a.prototype.second =
      function (a) {
        return (
          (a = b(a, { min: 0, max: 59 })),
          c(a.min < 0, "Chance: Min cannot be less than 0."),
          c(a.max > 59, "Chance: Max cannot be greater than 59."),
          c(a.min > a.max, "Chance: Min cannot be greater than Max."),
          this.natural({ min: a.min, max: a.max })
        );
      }),
    (a.prototype.month = function (a) {
      (a = b(a, { min: 1, max: 12 })),
        c(a.min < 1, "Chance: Min cannot be less than 1."),
        c(a.max > 12, "Chance: Max cannot be greater than 12."),
        c(a.min > a.max, "Chance: Min cannot be greater than Max.");
      var d = this.pick(this.months().slice(a.min - 1, a.max));
      return a.raw ? d : d.name;
    }),
    (a.prototype.months = function () {
      return this.get("months");
    }),
    (a.prototype.second = function () {
      return this.natural({ max: 59 });
    }),
    (a.prototype.timestamp = function () {
      return this.natural({
        min: 1,
        max: parseInt(new Date().getTime() / 1e3, 10),
      });
    }),
    (a.prototype.weekday = function (a) {
      a = b(a, { weekday_only: !1 });
      var c = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      return (
        a.weekday_only || (c.push("Saturday"), c.push("Sunday")),
        this.pickone(c)
      );
    }),
    (a.prototype.year = function (a) {
      return (
        (a = b(a, { min: new Date().getFullYear() })),
        (a.max = "undefined" != typeof a.max ? a.max : a.min + 100),
        this.natural(a).toString()
      );
    }),
    (a.prototype.cc = function (a) {
      a = b(a);
      var c, d, e;
      return (
        (c = a.type
          ? this.cc_type({ name: a.type, raw: !0 })
          : this.cc_type({ raw: !0 })),
        (d = c.prefix.split("")),
        (e = c.length - c.prefix.length - 1),
        (d = d.concat(this.n(this.integer, e, { min: 0, max: 9 }))),
        d.push(this.luhn_calculate(d.join(""))),
        d.join("")
      );
    }),
    (a.prototype.cc_types = function () {
      return this.get("cc_types");
    }),
    (a.prototype.cc_type = function (a) {
      a = b(a);
      var c = this.cc_types(),
        d = null;
      if (a.name) {
        for (var e = 0; e < c.length; e++)
          if (c[e].name === a.name || c[e].short_name === a.name) {
            d = c[e];
            break;
          }
        if (null === d)
          throw new RangeError(
            "Credit card type '" + a.name + "'' is not supported"
          );
      } else d = this.pick(c);
      return a.raw ? d : d.name;
    }),
    (a.prototype.currency_types = function () {
      return this.get("currency_types");
    }),
    (a.prototype.currency = function () {
      return this.pick(this.currency_types());
    }),
    (a.prototype.timezones = function () {
      return this.get("timezones");
    }),
    (a.prototype.timezone = function () {
      return this.pick(this.timezones());
    }),
    (a.prototype.currency_pair = function (a) {
      var b = this.unique(this.currency, 2, {
        comparator: function (a, b) {
          return a.reduce(function (a, c) {
            return a || c.code === b.code;
          }, !1);
        },
      });
      return a ? b[0].code + "/" + b[1].code : b;
    }),
    (a.prototype.dollar = function (a) {
      a = b(a, { max: 1e4, min: 0 });
      var c = this.floating({ min: a.min, max: a.max, fixed: 2 }).toString(),
        d = c.split(".")[1];
      return (
        void 0 === d ? (c += ".00") : d.length < 2 && (c += "0"),
        0 > c ? "-$" + c.replace("-", "") : "$" + c
      );
    }),
    (a.prototype.euro = function (a) {
      return Number(this.dollar(a).replace("$", "")).toLocaleString() + "€";
    }),
    (a.prototype.exp = function (a) {
      a = b(a);
      var c = {};
      return (
        (c.year = this.exp_year()),
        c.year === new Date().getFullYear().toString()
          ? (c.month = this.exp_month({ future: !0 }))
          : (c.month = this.exp_month()),
        a.raw ? c : c.month + "/" + c.year
      );
    }),
    (a.prototype.exp_month = function (a) {
      a = b(a);
      var c,
        d,
        e = new Date().getMonth() + 1;
      if (a.future && 12 !== e) {
        do (c = this.month({ raw: !0 }).numeric), (d = parseInt(c, 10));
        while (e >= d);
      } else c = this.month({ raw: !0 }).numeric;
      return c;
    }),
    (a.prototype.exp_year = function () {
      var a = new Date().getMonth() + 1,
        b = new Date().getFullYear();
      return this.year({ min: 12 === a ? b + 1 : b, max: b + 10 });
    }),
    (a.prototype.vat = function (a) {
      switch (((a = b(a, { country: "it" })), a.country.toLowerCase())) {
        case "it":
          return this.it_vat();
      }
    }),
    (a.prototype.it_vat = function () {
      var a = this.natural({ min: 1, max: 18e5 });
      return (
        (a =
          this.pad(a, 7) +
          this.pad(this.pick(this.provinces({ country: "it" })).code, 3)),
        a + this.luhn_calculate(a)
      );
    }),
    (a.prototype.cf = function (a) {
      a = a || {};
      var b = a.gender ? a.gender : this.gender(),
        c = a.first ? a.first : this.first({ gender: b, nationality: "it" }),
        d = a.last ? a.last : this.last({ nationality: "it" }),
        e = a.birthday ? a.birthday : this.birthday(),
        f = a.city
          ? a.city
          : this.pickone([
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "L",
              "M",
              "Z",
            ]) + this.pad(this.natural({ max: 999 }), 3),
        g = [],
        h = function (a, b) {
          var c,
            d = [];
          return (
            a.length < 3
              ? (d = a.split("").concat("XXX".split("")).splice(0, 3))
              : ((c = a
                  .toUpperCase()
                  .split("")
                  .map(function (a) {
                    return -1 !== "BCDFGHJKLMNPRSTVWZ".indexOf(a) ? a : void 0;
                  })
                  .join("")),
                c.length > 3 &&
                  (c = b ? c.substr(0, 3) : c[0] + c.substr(2, 2)),
                c.length < 3 &&
                  ((d = c),
                  (c = a
                    .toUpperCase()
                    .split("")
                    .map(function (a) {
                      return -1 !== "AEIOU".indexOf(a) ? a : void 0;
                    })
                    .join("")
                    .substr(0, 3 - d.length))),
                (d += c)),
            d
          );
        },
        i = function (a, b, c) {
          var d = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"];
          return (
            a.getFullYear().toString().substr(2) +
            d[a.getMonth()] +
            c.pad(a.getDate() + ("female" === b.toLowerCase() ? 40 : 0), 2)
          );
        },
        j = function (a) {
          for (
            var b = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              c = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ",
              d = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              e = "BAKPLCQDREVOSFTGUHMINJWZYX",
              f = 0,
              g = 0;
            15 > g;
            g++
          )
            f +=
              g % 2 !== 0
                ? d.indexOf(c[b.indexOf(a[g])])
                : e.indexOf(c[b.indexOf(a[g])]);
          return d[f % 26];
        };
      return (
        (g = g
          .concat(h(d, !0), h(c), i(e, b, this), f.toUpperCase().split(""))
          .join("")),
        (g += j(g.toUpperCase(), this)),
        g.toUpperCase()
      );
    }),
    (a.prototype.pl_pesel = function () {
      for (
        var a = this.natural({ min: 1, max: 9999999999 }),
          b = this.pad(a, 10).split(""),
          c = 0;
        c < b.length;
        c++
      )
        b[c] = parseInt(b[c]);
      var d =
        (1 * b[0] +
          3 * b[1] +
          7 * b[2] +
          9 * b[3] +
          1 * b[4] +
          3 * b[5] +
          7 * b[6] +
          9 * b[7] +
          1 * b[8] +
          3 * b[9]) %
        10;
      return 0 !== d && (d = 10 - d), b.join("") + d;
    }),
    (a.prototype.pl_nip = function () {
      for (
        var a = this.natural({ min: 1, max: 999999999 }),
          b = this.pad(a, 9).split(""),
          c = 0;
        c < b.length;
        c++
      )
        b[c] = parseInt(b[c]);
      var d =
        (6 * b[0] +
          5 * b[1] +
          7 * b[2] +
          2 * b[3] +
          3 * b[4] +
          4 * b[5] +
          5 * b[6] +
          6 * b[7] +
          7 * b[8]) %
        11;
      return 10 === d ? this.pl_nip() : b.join("") + d;
    }),
    (a.prototype.pl_regon = function () {
      for (
        var a = this.natural({ min: 1, max: 99999999 }),
          b = this.pad(a, 8).split(""),
          c = 0;
        c < b.length;
        c++
      )
        b[c] = parseInt(b[c]);
      var d =
        (8 * b[0] +
          9 * b[1] +
          2 * b[2] +
          3 * b[3] +
          4 * b[4] +
          5 * b[5] +
          6 * b[6] +
          7 * b[7]) %
        11;
      return 10 === d && (d = 0), b.join("") + d;
    }),
    (a.prototype.d4 = d({ min: 1, max: 4 })),
    (a.prototype.d6 = d({ min: 1, max: 6 })),
    (a.prototype.d8 = d({ min: 1, max: 8 })),
    (a.prototype.d10 = d({ min: 1, max: 10 })),
    (a.prototype.d12 = d({ min: 1, max: 12 })),
    (a.prototype.d20 = d({ min: 1, max: 20 })),
    (a.prototype.d30 = d({ min: 1, max: 30 })),
    (a.prototype.d100 = d({ min: 1, max: 100 })),
    (a.prototype.rpg = function (a, c) {
      if (((c = b(c)), a)) {
        var d = a.toLowerCase().split("d"),
          e = [];
        if (2 !== d.length || !parseInt(d[0], 10) || !parseInt(d[1], 10))
          throw new Error(
            "Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die"
          );
        for (var f = d[0]; f > 0; f--)
          e[f - 1] = this.natural({ min: 1, max: d[1] });
        return "undefined" != typeof c.sum && c.sum
          ? e.reduce(function (a, b) {
              return a + b;
            })
          : e;
      }
      throw new RangeError("A type of die roll must be included");
    }),
    (a.prototype.guid = function (a) {
      a = b(a, { version: 5 });
      var c = "abcdef1234567890",
        d = "ab89",
        e =
          this.string({ pool: c, length: 8 }) +
          "-" +
          this.string({ pool: c, length: 4 }) +
          "-" +
          a.version +
          this.string({ pool: c, length: 3 }) +
          "-" +
          this.string({ pool: d, length: 1 }) +
          this.string({ pool: c, length: 3 }) +
          "-" +
          this.string({ pool: c, length: 12 });
      return e;
    }),
    (a.prototype.hash = function (a) {
      a = b(a, { length: 40, casing: "lower" });
      var c = "upper" === a.casing ? m.toUpperCase() : m;
      return this.string({ pool: c, length: a.length });
    }),
    (a.prototype.luhn_check = function (a) {
      var b = a.toString(),
        c = +b.substring(b.length - 1);
      return c === this.luhn_calculate(+b.substring(0, b.length - 1));
    }),
    (a.prototype.luhn_calculate = function (a) {
      for (
        var b, c = a.toString().split("").reverse(), d = 0, e = 0, f = c.length;
        f > e;
        ++e
      )
        (b = +c[e]), e % 2 === 0 && ((b *= 2), b > 9 && (b -= 9)), (d += b);
      return (9 * d) % 10;
    }),
    (a.prototype.md5 = function (a) {
      var c = { str: "", key: null, raw: !1 };
      if (a)
        if ("string" == typeof a) (c.str = a), (a = {});
        else {
          if ("object" != typeof a) return null;
          if ("Array" === a.constructor) return null;
        }
      else (c.str = this.string()), (a = {});
      if (((c = b(a, c)), !c.str))
        throw new Error("A parameter is required to return an md5 hash.");
      return this.bimd5.md5(c.str, c.key, c.raw);
    }),
    (a.prototype.file = function (a) {
      var b,
        c,
        d = a || {},
        e = "fileExtension",
        f = Object.keys(this.get("fileExtension"));
      if (((b = this.word({ length: d.length })), d.extention))
        return (c = d.extention), b + "." + c;
      if (d.extentions) {
        if (Array.isArray(d.extentions))
          return (c = this.pickone(d.extentions)), b + "." + c;
        if (d.extentions.constructor === Object) {
          var g = d.extentions,
            h = Object.keys(g);
          return (c = this.pickone(g[this.pickone(h)])), b + "." + c;
        }
        throw new Error(
          "Expect collection of type Array or Object to be passed as an argument "
        );
      }
      if (d.fileType) {
        var i = d.fileType;
        if (-1 !== f.indexOf(i))
          return (c = this.pickone(this.get(e)[i])), b + "." + c;
        throw new Error(
          "Expect file type value to be 'raster', 'vector', '3d' or 'document' "
        );
      }
      return (c = this.pickone(this.get(e)[this.pickone(f)])), b + "." + c;
    });
  var p = {
      firstNames: {
        male: {
          en: [
            "James",
            "John",
            "Robert",
            "Michael",
            "William",
            "David",
            "Richard",
            "Joseph",
            "Charles",
            "Thomas",
            "Christopher",
            "Daniel",
            "Matthew",
            "George",
            "Donald",
            "Anthony",
            "Paul",
            "Mark",
            "Edward",
            "Steven",
            "Kenneth",
            "Andrew",
            "Brian",
            "Joshua",
            "Kevin",
            "Ronald",
            "Timothy",
            "Jason",
            "Jeffrey",
            "Frank",
            "Gary",
            "Ryan",
            "Nicholas",
            "Eric",
            "Stephen",
            "Jacob",
            "Larry",
            "Jonathan",
            "Scott",
            "Raymond",
            "Justin",
            "Brandon",
            "Gregory",
            "Samuel",
            "Benjamin",
            "Patrick",
            "Jack",
            "Henry",
            "Walter",
            "Dennis",
            "Jerry",
            "Alexander",
            "Peter",
            "Tyler",
            "Douglas",
            "Harold",
            "Aaron",
            "Jose",
            "Adam",
            "Arthur",
            "Zachary",
            "Carl",
            "Nathan",
            "Albert",
            "Kyle",
            "Lawrence",
            "Joe",
            "Willie",
            "Gerald",
            "Roger",
            "Keith",
            "Jeremy",
            "Terry",
            "Harry",
            "Ralph",
            "Sean",
            "Jesse",
            "Roy",
            "Louis",
            "Billy",
            "Austin",
            "Bruce",
            "Eugene",
            "Christian",
            "Bryan",
            "Wayne",
            "Russell",
            "Howard",
            "Fred",
            "Ethan",
            "Jordan",
            "Philip",
            "Alan",
            "Juan",
            "Randy",
            "Vincent",
            "Bobby",
            "Dylan",
            "Johnny",
            "Phillip",
            "Victor",
            "Clarence",
            "Ernest",
            "Martin",
            "Craig",
            "Stanley",
            "Shawn",
            "Travis",
            "Bradley",
            "Leonard",
            "Earl",
            "Gabriel",
            "Jimmy",
            "Francis",
            "Todd",
            "Noah",
            "Danny",
            "Dale",
            "Cody",
            "Carlos",
            "Allen",
            "Frederick",
            "Logan",
            "Curtis",
            "Alex",
            "Joel",
            "Luis",
            "Norman",
            "Marvin",
            "Glenn",
            "Tony",
            "Nathaniel",
            "Rodney",
            "Melvin",
            "Alfred",
            "Steve",
            "Cameron",
            "Chad",
            "Edwin",
            "Caleb",
            "Evan",
            "Antonio",
            "Lee",
            "Herbert",
            "Jeffery",
            "Isaac",
            "Derek",
            "Ricky",
            "Marcus",
            "Theodore",
            "Elijah",
            "Luke",
            "Jesus",
            "Eddie",
            "Troy",
            "Mike",
            "Dustin",
            "Ray",
            "Adrian",
            "Bernard",
            "Leroy",
            "Angel",
            "Randall",
            "Wesley",
            "Ian",
            "Jared",
            "Mason",
            "Hunter",
            "Calvin",
            "Oscar",
            "Clifford",
            "Jay",
            "Shane",
            "Ronnie",
            "Barry",
            "Lucas",
            "Corey",
            "Manuel",
            "Leo",
            "Tommy",
            "Warren",
            "Jackson",
            "Isaiah",
            "Connor",
            "Don",
            "Dean",
            "Jon",
            "Julian",
            "Miguel",
            "Bill",
            "Lloyd",
            "Charlie",
            "Mitchell",
            "Leon",
            "Jerome",
            "Darrell",
            "Jeremiah",
            "Alvin",
            "Brett",
            "Seth",
            "Floyd",
            "Jim",
            "Blake",
            "Micheal",
            "Gordon",
            "Trevor",
            "Lewis",
            "Erik",
            "Edgar",
            "Vernon",
            "Devin",
            "Gavin",
            "Jayden",
            "Chris",
            "Clyde",
            "Tom",
            "Derrick",
            "Mario",
            "Brent",
            "Marc",
            "Herman",
            "Chase",
            "Dominic",
            "Ricardo",
            "Franklin",
            "Maurice",
            "Max",
            "Aiden",
            "Owen",
            "Lester",
            "Gilbert",
            "Elmer",
            "Gene",
            "Francisco",
            "Glen",
            "Cory",
            "Garrett",
            "Clayton",
            "Sam",
            "Jorge",
            "Chester",
            "Alejandro",
            "Jeff",
            "Harvey",
            "Milton",
            "Cole",
            "Ivan",
            "Andre",
            "Duane",
            "Landon",
          ],
          it: [
            "Adolfo",
            "Alberto",
            "Aldo",
            "Alessandro",
            "Alessio",
            "Alfredo",
            "Alvaro",
            "Andrea",
            "Angelo",
            "Angiolo",
            "Antonino",
            "Antonio",
            "Attilio",
            "Benito",
            "Bernardo",
            "Bruno",
            "Carlo",
            "Cesare",
            "Christian",
            "Claudio",
            "Corrado",
            "Cosimo",
            "Cristian",
            "Cristiano",
            "Daniele",
            "Dario",
            "David",
            "Davide",
            "Diego",
            "Dino",
            "Domenico",
            "Duccio",
            "Edoardo",
            "Elia",
            "Elio",
            "Emanuele",
            "Emiliano",
            "Emilio",
            "Enrico",
            "Enzo",
            "Ettore",
            "Fabio",
            "Fabrizio",
            "Federico",
            "Ferdinando",
            "Fernando",
            "Filippo",
            "Francesco",
            "Franco",
            "Gabriele",
            "Giacomo",
            "Giampaolo",
            "Giampiero",
            "Giancarlo",
            "Gianfranco",
            "Gianluca",
            "Gianmarco",
            "Gianni",
            "Gino",
            "Giorgio",
            "Giovanni",
            "Giuliano",
            "Giulio",
            "Giuseppe",
            "Graziano",
            "Gregorio",
            "Guido",
            "Iacopo",
            "Jacopo",
            "Lapo",
            "Leonardo",
            "Lorenzo",
            "Luca",
            "Luciano",
            "Luigi",
            "Manuel",
            "Marcello",
            "Marco",
            "Marino",
            "Mario",
            "Massimiliano",
            "Massimo",
            "Matteo",
            "Mattia",
            "Maurizio",
            "Mauro",
            "Michele",
            "Mirko",
            "Mohamed",
            "Nello",
            "Neri",
            "Niccolò",
            "Nicola",
            "Osvaldo",
            "Otello",
            "Paolo",
            "Pier Luigi",
            "Piero",
            "Pietro",
            "Raffaele",
            "Remo",
            "Renato",
            "Renzo",
            "Riccardo",
            "Roberto",
            "Rolando",
            "Romano",
            "Salvatore",
            "Samuele",
            "Sandro",
            "Sergio",
            "Silvano",
            "Simone",
            "Stefano",
            "Thomas",
            "Tommaso",
            "Ubaldo",
            "Ugo",
            "Umberto",
            "Valerio",
            "Valter",
            "Vasco",
            "Vincenzo",
            "Vittorio",
          ],
        },
        female: {
          en: [
            "Mary",
            "Emma",
            "Elizabeth",
            "Minnie",
            "Margaret",
            "Ida",
            "Alice",
            "Bertha",
            "Sarah",
            "Annie",
            "Clara",
            "Ella",
            "Florence",
            "Cora",
            "Martha",
            "Laura",
            "Nellie",
            "Grace",
            "Carrie",
            "Maude",
            "Mabel",
            "Bessie",
            "Jennie",
            "Gertrude",
            "Julia",
            "Hattie",
            "Edith",
            "Mattie",
            "Rose",
            "Catherine",
            "Lillian",
            "Ada",
            "Lillie",
            "Helen",
            "Jessie",
            "Louise",
            "Ethel",
            "Lula",
            "Myrtle",
            "Eva",
            "Frances",
            "Lena",
            "Lucy",
            "Edna",
            "Maggie",
            "Pearl",
            "Daisy",
            "Fannie",
            "Josephine",
            "Dora",
            "Rosa",
            "Katherine",
            "Agnes",
            "Marie",
            "Nora",
            "May",
            "Mamie",
            "Blanche",
            "Stella",
            "Ellen",
            "Nancy",
            "Effie",
            "Sallie",
            "Nettie",
            "Della",
            "Lizzie",
            "Flora",
            "Susie",
            "Maud",
            "Mae",
            "Etta",
            "Harriet",
            "Sadie",
            "Caroline",
            "Katie",
            "Lydia",
            "Elsie",
            "Kate",
            "Susan",
            "Mollie",
            "Alma",
            "Addie",
            "Georgia",
            "Eliza",
            "Lulu",
            "Nannie",
            "Lottie",
            "Amanda",
            "Belle",
            "Charlotte",
            "Rebecca",
            "Ruth",
            "Viola",
            "Olive",
            "Amelia",
            "Hannah",
            "Jane",
            "Virginia",
            "Emily",
            "Matilda",
            "Irene",
            "Kathryn",
            "Esther",
            "Willie",
            "Henrietta",
            "Ollie",
            "Amy",
            "Rachel",
            "Sara",
            "Estella",
            "Theresa",
            "Augusta",
            "Ora",
            "Pauline",
            "Josie",
            "Lola",
            "Sophia",
            "Leona",
            "Anne",
            "Mildred",
            "Ann",
            "Beulah",
            "Callie",
            "Lou",
            "Delia",
            "Eleanor",
            "Barbara",
            "Iva",
            "Louisa",
            "Maria",
            "Mayme",
            "Evelyn",
            "Estelle",
            "Nina",
            "Betty",
            "Marion",
            "Bettie",
            "Dorothy",
            "Luella",
            "Inez",
            "Lela",
            "Rosie",
            "Allie",
            "Millie",
            "Janie",
            "Cornelia",
            "Victoria",
            "Ruby",
            "Winifred",
            "Alta",
            "Celia",
            "Christine",
            "Beatrice",
            "Birdie",
            "Harriett",
            "Mable",
            "Myra",
            "Sophie",
            "Tillie",
            "Isabel",
            "Sylvia",
            "Carolyn",
            "Isabelle",
            "Leila",
            "Sally",
            "Ina",
            "Essie",
            "Bertie",
            "Nell",
            "Alberta",
            "Katharine",
            "Lora",
            "Rena",
            "Mina",
            "Rhoda",
            "Mathilda",
            "Abbie",
            "Eula",
            "Dollie",
            "Hettie",
            "Eunice",
            "Fanny",
            "Ola",
            "Lenora",
            "Adelaide",
            "Christina",
            "Lelia",
            "Nelle",
            "Sue",
            "Johanna",
            "Lilly",
            "Lucinda",
            "Minerva",
            "Lettie",
            "Roxie",
            "Cynthia",
            "Helena",
            "Hilda",
            "Hulda",
            "Bernice",
            "Genevieve",
            "Jean",
            "Cordelia",
            "Marian",
            "Francis",
            "Jeanette",
            "Adeline",
            "Gussie",
            "Leah",
            "Lois",
            "Lura",
            "Mittie",
            "Hallie",
            "Isabella",
            "Olga",
            "Phoebe",
            "Teresa",
            "Hester",
            "Lida",
            "Lina",
            "Winnie",
            "Claudia",
            "Marguerite",
            "Vera",
            "Cecelia",
            "Bess",
            "Emilie",
            "John",
            "Rosetta",
            "Verna",
            "Myrtie",
            "Cecilia",
            "Elva",
            "Olivia",
            "Ophelia",
            "Georgie",
            "Elnora",
            "Violet",
            "Adele",
            "Lily",
            "Linnie",
            "Loretta",
            "Madge",
            "Polly",
            "Virgie",
            "Eugenia",
            "Lucile",
            "Lucille",
            "Mabelle",
            "Rosalie",
          ],
          it: [
            "Ada",
            "Adriana",
            "Alessandra",
            "Alessia",
            "Alice",
            "Angela",
            "Anna",
            "Anna Maria",
            "Annalisa",
            "Annita",
            "Annunziata",
            "Antonella",
            "Arianna",
            "Asia",
            "Assunta",
            "Aurora",
            "Barbara",
            "Beatrice",
            "Benedetta",
            "Bianca",
            "Bruna",
            "Camilla",
            "Carla",
            "Carlotta",
            "Carmela",
            "Carolina",
            "Caterina",
            "Catia",
            "Cecilia",
            "Chiara",
            "Cinzia",
            "Clara",
            "Claudia",
            "Costanza",
            "Cristina",
            "Daniela",
            "Debora",
            "Diletta",
            "Dina",
            "Donatella",
            "Elena",
            "Eleonora",
            "Elisa",
            "Elisabetta",
            "Emanuela",
            "Emma",
            "Eva",
            "Federica",
            "Fernanda",
            "Fiorella",
            "Fiorenza",
            "Flora",
            "Franca",
            "Francesca",
            "Gabriella",
            "Gaia",
            "Gemma",
            "Giada",
            "Gianna",
            "Gina",
            "Ginevra",
            "Giorgia",
            "Giovanna",
            "Giulia",
            "Giuliana",
            "Giuseppa",
            "Giuseppina",
            "Grazia",
            "Graziella",
            "Greta",
            "Ida",
            "Ilaria",
            "Ines",
            "Iolanda",
            "Irene",
            "Irma",
            "Isabella",
            "Jessica",
            "Laura",
            "Leda",
            "Letizia",
            "Licia",
            "Lidia",
            "Liliana",
            "Lina",
            "Linda",
            "Lisa",
            "Livia",
            "Loretta",
            "Luana",
            "Lucia",
            "Luciana",
            "Lucrezia",
            "Luisa",
            "Manuela",
            "Mara",
            "Marcella",
            "Margherita",
            "Maria",
            "Maria Cristina",
            "Maria Grazia",
            "Maria Luisa",
            "Maria Pia",
            "Maria Teresa",
            "Marina",
            "Marisa",
            "Marta",
            "Martina",
            "Marzia",
            "Matilde",
            "Melissa",
            "Michela",
            "Milena",
            "Mirella",
            "Monica",
            "Natalina",
            "Nella",
            "Nicoletta",
            "Noemi",
            "Olga",
            "Paola",
            "Patrizia",
            "Piera",
            "Pierina",
            "Raffaella",
            "Rebecca",
            "Renata",
            "Rina",
            "Rita",
            "Roberta",
            "Rosa",
            "Rosanna",
            "Rossana",
            "Rossella",
            "Sabrina",
            "Sandra",
            "Sara",
            "Serena",
            "Silvana",
            "Silvia",
            "Simona",
            "Simonetta",
            "Sofia",
            "Sonia",
            "Stefania",
            "Susanna",
            "Teresa",
            "Tina",
            "Tiziana",
            "Tosca",
            "Valentina",
            "Valeria",
            "Vanda",
            "Vanessa",
            "Vanna",
            "Vera",
            "Veronica",
            "Vilma",
            "Viola",
            "Virginia",
            "Vittoria",
          ],
        },
      },
      lastNames: {
        en: [
          "Smith",
          "Johnson",
          "Williams",
          "Jones",
          "Brown",
          "Davis",
          "Miller",
          "Wilson",
          "Moore",
          "Taylor",
          "Anderson",
          "Thomas",
          "Jackson",
          "White",
          "Harris",
          "Martin",
          "Thompson",
          "Garcia",
          "Martinez",
          "Robinson",
          "Clark",
          "Rodriguez",
          "Lewis",
          "Lee",
          "Walker",
          "Hall",
          "Allen",
          "Young",
          "Hernandez",
          "King",
          "Wright",
          "Lopez",
          "Hill",
          "Scott",
          "Green",
          "Adams",
          "Baker",
          "Gonzalez",
          "Nelson",
          "Carter",
          "Mitchell",
          "Perez",
          "Roberts",
          "Turner",
          "Phillips",
          "Campbell",
          "Parker",
          "Evans",
          "Edwards",
          "Collins",
          "Stewart",
          "Sanchez",
          "Morris",
          "Rogers",
          "Reed",
          "Cook",
          "Morgan",
          "Bell",
          "Murphy",
          "Bailey",
          "Rivera",
          "Cooper",
          "Richardson",
          "Cox",
          "Howard",
          "Ward",
          "Torres",
          "Peterson",
          "Gray",
          "Ramirez",
          "James",
          "Watson",
          "Brooks",
          "Kelly",
          "Sanders",
          "Price",
          "Bennett",
          "Wood",
          "Barnes",
          "Ross",
          "Henderson",
          "Coleman",
          "Jenkins",
          "Perry",
          "Powell",
          "Long",
          "Patterson",
          "Hughes",
          "Flores",
          "Washington",
          "Butler",
          "Simmons",
          "Foster",
          "Gonzales",
          "Bryant",
          "Alexander",
          "Russell",
          "Griffin",
          "Diaz",
          "Hayes",
          "Myers",
          "Ford",
          "Hamilton",
          "Graham",
          "Sullivan",
          "Wallace",
          "Woods",
          "Cole",
          "West",
          "Jordan",
          "Owens",
          "Reynolds",
          "Fisher",
          "Ellis",
          "Harrison",
          "Gibson",
          "McDonald",
          "Cruz",
          "Marshall",
          "Ortiz",
          "Gomez",
          "Murray",
          "Freeman",
          "Wells",
          "Webb",
          "Simpson",
          "Stevens",
          "Tucker",
          "Porter",
          "Hunter",
          "Hicks",
          "Crawford",
          "Henry",
          "Boyd",
          "Mason",
          "Morales",
          "Kennedy",
          "Warren",
          "Dixon",
          "Ramos",
          "Reyes",
          "Burns",
          "Gordon",
          "Shaw",
          "Holmes",
          "Rice",
          "Robertson",
          "Hunt",
          "Black",
          "Daniels",
          "Palmer",
          "Mills",
          "Nichols",
          "Grant",
          "Knight",
          "Ferguson",
          "Rose",
          "Stone",
          "Hawkins",
          "Dunn",
          "Perkins",
          "Hudson",
          "Spencer",
          "Gardner",
          "Stephens",
          "Payne",
          "Pierce",
          "Berry",
          "Matthews",
          "Arnold",
          "Wagner",
          "Willis",
          "Ray",
          "Watkins",
          "Olson",
          "Carroll",
          "Duncan",
          "Snyder",
          "Hart",
          "Cunningham",
          "Bradley",
          "Lane",
          "Andrews",
          "Ruiz",
          "Harper",
          "Fox",
          "Riley",
          "Armstrong",
          "Carpenter",
          "Weaver",
          "Greene",
          "Lawrence",
          "Elliott",
          "Chavez",
          "Sims",
          "Austin",
          "Peters",
          "Kelley",
          "Franklin",
          "Lawson",
          "Fields",
          "Gutierrez",
          "Ryan",
          "Schmidt",
          "Carr",
          "Vasquez",
          "Castillo",
          "Wheeler",
          "Chapman",
          "Oliver",
          "Montgomery",
          "Richards",
          "Williamson",
          "Johnston",
          "Banks",
          "Meyer",
          "Bishop",
          "McCoy",
          "Howell",
          "Alvarez",
          "Morrison",
          "Hansen",
          "Fernandez",
          "Garza",
          "Harvey",
          "Little",
          "Burton",
          "Stanley",
          "Nguyen",
          "George",
          "Jacobs",
          "Reid",
          "Kim",
          "Fuller",
          "Lynch",
          "Dean",
          "Gilbert",
          "Garrett",
          "Romero",
          "Welch",
          "Larson",
          "Frazier",
          "Burke",
          "Hanson",
          "Day",
          "Mendoza",
          "Moreno",
          "Bowman",
          "Medina",
          "Fowler",
          "Brewer",
          "Hoffman",
          "Carlson",
          "Silva",
          "Pearson",
          "Holland",
          "Douglas",
          "Fleming",
          "Jensen",
          "Vargas",
          "Byrd",
          "Davidson",
          "Hopkins",
          "May",
          "Terry",
          "Herrera",
          "Wade",
          "Soto",
          "Walters",
          "Curtis",
          "Neal",
          "Caldwell",
          "Lowe",
          "Jennings",
          "Barnett",
          "Graves",
          "Jimenez",
          "Horton",
          "Shelton",
          "Barrett",
          "Obrien",
          "Castro",
          "Sutton",
          "Gregory",
          "McKinney",
          "Lucas",
          "Miles",
          "Craig",
          "Rodriquez",
          "Chambers",
          "Holt",
          "Lambert",
          "Fletcher",
          "Watts",
          "Bates",
          "Hale",
          "Rhodes",
          "Pena",
          "Beck",
          "Newman",
          "Haynes",
          "McDaniel",
          "Mendez",
          "Bush",
          "Vaughn",
          "Parks",
          "Dawson",
          "Santiago",
          "Norris",
          "Hardy",
          "Love",
          "Steele",
          "Curry",
          "Powers",
          "Schultz",
          "Barker",
          "Guzman",
          "Page",
          "Munoz",
          "Ball",
          "Keller",
          "Chandler",
          "Weber",
          "Leonard",
          "Walsh",
          "Lyons",
          "Ramsey",
          "Wolfe",
          "Schneider",
          "Mullins",
          "Benson",
          "Sharp",
          "Bowen",
          "Daniel",
          "Barber",
          "Cummings",
          "Hines",
          "Baldwin",
          "Griffith",
          "Valdez",
          "Hubbard",
          "Salazar",
          "Reeves",
          "Warner",
          "Stevenson",
          "Burgess",
          "Santos",
          "Tate",
          "Cross",
          "Garner",
          "Mann",
          "Mack",
          "Moss",
          "Thornton",
          "Dennis",
          "McGee",
          "Farmer",
          "Delgado",
          "Aguilar",
          "Vega",
          "Glover",
          "Manning",
          "Cohen",
          "Harmon",
          "Rodgers",
          "Robbins",
          "Newton",
          "Todd",
          "Blair",
          "Higgins",
          "Ingram",
          "Reese",
          "Cannon",
          "Strickland",
          "Townsend",
          "Potter",
          "Goodwin",
          "Walton",
          "Rowe",
          "Hampton",
          "Ortega",
          "Patton",
          "Swanson",
          "Joseph",
          "Francis",
          "Goodman",
          "Maldonado",
          "Yates",
          "Becker",
          "Erickson",
          "Hodges",
          "Rios",
          "Conner",
          "Adkins",
          "Webster",
          "Norman",
          "Malone",
          "Hammond",
          "Flowers",
          "Cobb",
          "Moody",
          "Quinn",
          "Blake",
          "Maxwell",
          "Pope",
          "Floyd",
          "Osborne",
          "Paul",
          "McCarthy",
          "Guerrero",
          "Lindsey",
          "Estrada",
          "Sandoval",
          "Gibbs",
          "Tyler",
          "Gross",
          "Fitzgerald",
          "Stokes",
          "Doyle",
          "Sherman",
          "Saunders",
          "Wise",
          "Colon",
          "Gill",
          "Alvarado",
          "Greer",
          "Padilla",
          "Simon",
          "Waters",
          "Nunez",
          "Ballard",
          "Schwartz",
          "McBride",
          "Houston",
          "Christensen",
          "Klein",
          "Pratt",
          "Briggs",
          "Parsons",
          "McLaughlin",
          "Zimmerman",
          "French",
          "Buchanan",
          "Moran",
          "Copeland",
          "Roy",
          "Pittman",
          "Brady",
          "McCormick",
          "Holloway",
          "Brock",
          "Poole",
          "Frank",
          "Logan",
          "Owen",
          "Bass",
          "Marsh",
          "Drake",
          "Wong",
          "Jefferson",
          "Park",
          "Morton",
          "Abbott",
          "Sparks",
          "Patrick",
          "Norton",
          "Huff",
          "Clayton",
          "Massey",
          "Lloyd",
          "Figueroa",
          "Carson",
          "Bowers",
          "Roberson",
          "Barton",
          "Tran",
          "Lamb",
          "Harrington",
          "Casey",
          "Boone",
          "Cortez",
          "Clarke",
          "Mathis",
          "Singleton",
          "Wilkins",
          "Cain",
          "Bryan",
          "Underwood",
          "Hogan",
          "McKenzie",
          "Collier",
          "Luna",
          "Phelps",
          "McGuire",
          "Allison",
          "Bridges",
          "Wilkerson",
          "Nash",
          "Summers",
          "Atkins",
        ],
        it: [
          "Acciai",
          "Aglietti",
          "Agostini",
          "Agresti",
          "Ahmed",
          "Aiazzi",
          "Albanese",
          "Alberti",
          "Alessi",
          "Alfani",
          "Alinari",
          "Alterini",
          "Amato",
          "Ammannati",
          "Ancillotti",
          "Andrei",
          "Andreini",
          "Andreoni",
          "Angeli",
          "Anichini",
          "Antonelli",
          "Antonini",
          "Arena",
          "Ariani",
          "Arnetoli",
          "Arrighi",
          "Baccani",
          "Baccetti",
          "Bacci",
          "Bacherini",
          "Badii",
          "Baggiani",
          "Baglioni",
          "Bagni",
          "Bagnoli",
          "Baldassini",
          "Baldi",
          "Baldini",
          "Ballerini",
          "Balli",
          "Ballini",
          "Balloni",
          "Bambi",
          "Banchi",
          "Bandinelli",
          "Bandini",
          "Bani",
          "Barbetti",
          "Barbieri",
          "Barchielli",
          "Bardazzi",
          "Bardelli",
          "Bardi",
          "Barducci",
          "Bargellini",
          "Bargiacchi",
          "Barni",
          "Baroncelli",
          "Baroncini",
          "Barone",
          "Baroni",
          "Baronti",
          "Bartalesi",
          "Bartoletti",
          "Bartoli",
          "Bartolini",
          "Bartoloni",
          "Bartolozzi",
          "Basagni",
          "Basile",
          "Bassi",
          "Batacchi",
          "Battaglia",
          "Battaglini",
          "Bausi",
          "Becagli",
          "Becattini",
          "Becchi",
          "Becucci",
          "Bellandi",
          "Bellesi",
          "Belli",
          "Bellini",
          "Bellucci",
          "Bencini",
          "Benedetti",
          "Benelli",
          "Beni",
          "Benini",
          "Bensi",
          "Benucci",
          "Benvenuti",
          "Berlincioni",
          "Bernacchioni",
          "Bernardi",
          "Bernardini",
          "Berni",
          "Bernini",
          "Bertelli",
          "Berti",
          "Bertini",
          "Bessi",
          "Betti",
          "Bettini",
          "Biagi",
          "Biagini",
          "Biagioni",
          "Biagiotti",
          "Biancalani",
          "Bianchi",
          "Bianchini",
          "Bianco",
          "Biffoli",
          "Bigazzi",
          "Bigi",
          "Biliotti",
          "Billi",
          "Binazzi",
          "Bindi",
          "Bini",
          "Biondi",
          "Bizzarri",
          "Bocci",
          "Bogani",
          "Bolognesi",
          "Bonaiuti",
          "Bonanni",
          "Bonciani",
          "Boncinelli",
          "Bondi",
          "Bonechi",
          "Bongini",
          "Boni",
          "Bonini",
          "Borchi",
          "Boretti",
          "Borghi",
          "Borghini",
          "Borgioli",
          "Borri",
          "Borselli",
          "Boschi",
          "Bottai",
          "Bracci",
          "Braccini",
          "Brandi",
          "Braschi",
          "Bravi",
          "Brazzini",
          "Breschi",
          "Brilli",
          "Brizzi",
          "Brogelli",
          "Brogi",
          "Brogioni",
          "Brunelli",
          "Brunetti",
          "Bruni",
          "Bruno",
          "Brunori",
          "Bruschi",
          "Bucci",
          "Bucciarelli",
          "Buccioni",
          "Bucelli",
          "Bulli",
          "Burberi",
          "Burchi",
          "Burgassi",
          "Burroni",
          "Bussotti",
          "Buti",
          "Caciolli",
          "Caiani",
          "Calabrese",
          "Calamai",
          "Calamandrei",
          "Caldini",
          "Calo'",
          "Calonaci",
          "Calosi",
          "Calvelli",
          "Cambi",
          "Camiciottoli",
          "Cammelli",
          "Cammilli",
          "Campolmi",
          "Cantini",
          "Capanni",
          "Capecchi",
          "Caponi",
          "Cappelletti",
          "Cappelli",
          "Cappellini",
          "Cappugi",
          "Capretti",
          "Caputo",
          "Carbone",
          "Carboni",
          "Cardini",
          "Carlesi",
          "Carletti",
          "Carli",
          "Caroti",
          "Carotti",
          "Carrai",
          "Carraresi",
          "Carta",
          "Caruso",
          "Casalini",
          "Casati",
          "Caselli",
          "Casini",
          "Castagnoli",
          "Castellani",
          "Castelli",
          "Castellucci",
          "Catalano",
          "Catarzi",
          "Catelani",
          "Cavaciocchi",
          "Cavallaro",
          "Cavallini",
          "Cavicchi",
          "Cavini",
          "Ceccarelli",
          "Ceccatelli",
          "Ceccherelli",
          "Ceccherini",
          "Cecchi",
          "Cecchini",
          "Cecconi",
          "Cei",
          "Cellai",
          "Celli",
          "Cellini",
          "Cencetti",
          "Ceni",
          "Cenni",
          "Cerbai",
          "Cesari",
          "Ceseri",
          "Checcacci",
          "Checchi",
          "Checcucci",
          "Cheli",
          "Chellini",
          "Chen",
          "Cheng",
          "Cherici",
          "Cherubini",
          "Chiaramonti",
          "Chiarantini",
          "Chiarelli",
          "Chiari",
          "Chiarini",
          "Chiarugi",
          "Chiavacci",
          "Chiesi",
          "Chimenti",
          "Chini",
          "Chirici",
          "Chiti",
          "Ciabatti",
          "Ciampi",
          "Cianchi",
          "Cianfanelli",
          "Cianferoni",
          "Ciani",
          "Ciapetti",
          "Ciappi",
          "Ciardi",
          "Ciatti",
          "Cicali",
          "Ciccone",
          "Cinelli",
          "Cini",
          "Ciobanu",
          "Ciolli",
          "Cioni",
          "Cipriani",
          "Cirillo",
          "Cirri",
          "Ciucchi",
          "Ciuffi",
          "Ciulli",
          "Ciullini",
          "Clemente",
          "Cocchi",
          "Cognome",
          "Coli",
          "Collini",
          "Colombo",
          "Colzi",
          "Comparini",
          "Conforti",
          "Consigli",
          "Conte",
          "Conti",
          "Contini",
          "Coppini",
          "Coppola",
          "Corsi",
          "Corsini",
          "Corti",
          "Cortini",
          "Cosi",
          "Costa",
          "Costantini",
          "Costantino",
          "Cozzi",
          "Cresci",
          "Crescioli",
          "Cresti",
          "Crini",
          "Curradi",
          "D'Agostino",
          "D'Alessandro",
          "D'Amico",
          "D'Angelo",
          "Daddi",
          "Dainelli",
          "Dallai",
          "Danti",
          "Davitti",
          "De Angelis",
          "De Luca",
          "De Marco",
          "De Rosa",
          "De Santis",
          "De Simone",
          "De Vita",
          "Degl'Innocenti",
          "Degli Innocenti",
          "Dei",
          "Del Lungo",
          "Del Re",
          "Di Marco",
          "Di Stefano",
          "Dini",
          "Diop",
          "Dobre",
          "Dolfi",
          "Donati",
          "Dondoli",
          "Dong",
          "Donnini",
          "Ducci",
          "Dumitru",
          "Ermini",
          "Esposito",
          "Evangelisti",
          "Fabbri",
          "Fabbrini",
          "Fabbrizzi",
          "Fabbroni",
          "Fabbrucci",
          "Fabiani",
          "Facchini",
          "Faggi",
          "Fagioli",
          "Failli",
          "Faini",
          "Falciani",
          "Falcini",
          "Falcone",
          "Fallani",
          "Falorni",
          "Falsini",
          "Falugiani",
          "Fancelli",
          "Fanelli",
          "Fanetti",
          "Fanfani",
          "Fani",
          "Fantappie'",
          "Fantechi",
          "Fanti",
          "Fantini",
          "Fantoni",
          "Farina",
          "Fattori",
          "Favilli",
          "Fedi",
          "Fei",
          "Ferrante",
          "Ferrara",
          "Ferrari",
          "Ferraro",
          "Ferretti",
          "Ferri",
          "Ferrini",
          "Ferroni",
          "Fiaschi",
          "Fibbi",
          "Fiesoli",
          "Filippi",
          "Filippini",
          "Fini",
          "Fioravanti",
          "Fiore",
          "Fiorentini",
          "Fiorini",
          "Fissi",
          "Focardi",
          "Foggi",
          "Fontana",
          "Fontanelli",
          "Fontani",
          "Forconi",
          "Formigli",
          "Forte",
          "Forti",
          "Fortini",
          "Fossati",
          "Fossi",
          "Francalanci",
          "Franceschi",
          "Franceschini",
          "Franchi",
          "Franchini",
          "Franci",
          "Francini",
          "Francioni",
          "Franco",
          "Frassineti",
          "Frati",
          "Fratini",
          "Frilli",
          "Frizzi",
          "Frosali",
          "Frosini",
          "Frullini",
          "Fusco",
          "Fusi",
          "Gabbrielli",
          "Gabellini",
          "Gagliardi",
          "Galanti",
          "Galardi",
          "Galeotti",
          "Galletti",
          "Galli",
          "Gallo",
          "Gallori",
          "Gambacciani",
          "Gargani",
          "Garofalo",
          "Garuglieri",
          "Gashi",
          "Gasperini",
          "Gatti",
          "Gelli",
          "Gensini",
          "Gentile",
          "Gentili",
          "Geri",
          "Gerini",
          "Gheri",
          "Ghini",
          "Giachetti",
          "Giachi",
          "Giacomelli",
          "Gianassi",
          "Giani",
          "Giannelli",
          "Giannetti",
          "Gianni",
          "Giannini",
          "Giannoni",
          "Giannotti",
          "Giannozzi",
          "Gigli",
          "Giordano",
          "Giorgetti",
          "Giorgi",
          "Giovacchini",
          "Giovannelli",
          "Giovannetti",
          "Giovannini",
          "Giovannoni",
          "Giuliani",
          "Giunti",
          "Giuntini",
          "Giusti",
          "Gonnelli",
          "Goretti",
          "Gori",
          "Gradi",
          "Gramigni",
          "Grassi",
          "Grasso",
          "Graziani",
          "Grazzini",
          "Greco",
          "Grifoni",
          "Grillo",
          "Grimaldi",
          "Grossi",
          "Gualtieri",
          "Guarducci",
          "Guarino",
          "Guarnieri",
          "Guasti",
          "Guerra",
          "Guerri",
          "Guerrini",
          "Guidi",
          "Guidotti",
          "He",
          "Hoxha",
          "Hu",
          "Huang",
          "Iandelli",
          "Ignesti",
          "Innocenti",
          "Jin",
          "La Rosa",
          "Lai",
          "Landi",
          "Landini",
          "Lanini",
          "Lapi",
          "Lapini",
          "Lari",
          "Lascialfari",
          "Lastrucci",
          "Latini",
          "Lazzeri",
          "Lazzerini",
          "Lelli",
          "Lenzi",
          "Leonardi",
          "Leoncini",
          "Leone",
          "Leoni",
          "Lepri",
          "Li",
          "Liao",
          "Lin",
          "Linari",
          "Lippi",
          "Lisi",
          "Livi",
          "Lombardi",
          "Lombardini",
          "Lombardo",
          "Longo",
          "Lopez",
          "Lorenzi",
          "Lorenzini",
          "Lorini",
          "Lotti",
          "Lu",
          "Lucchesi",
          "Lucherini",
          "Lunghi",
          "Lupi",
          "Madiai",
          "Maestrini",
          "Maffei",
          "Maggi",
          "Maggini",
          "Magherini",
          "Magini",
          "Magnani",
          "Magnelli",
          "Magni",
          "Magnolfi",
          "Magrini",
          "Malavolti",
          "Malevolti",
          "Manca",
          "Mancini",
          "Manetti",
          "Manfredi",
          "Mangani",
          "Mannelli",
          "Manni",
          "Mannini",
          "Mannucci",
          "Manuelli",
          "Manzini",
          "Marcelli",
          "Marchese",
          "Marchetti",
          "Marchi",
          "Marchiani",
          "Marchionni",
          "Marconi",
          "Marcucci",
          "Margheri",
          "Mari",
          "Mariani",
          "Marilli",
          "Marinai",
          "Marinari",
          "Marinelli",
          "Marini",
          "Marino",
          "Mariotti",
          "Marsili",
          "Martelli",
          "Martinelli",
          "Martini",
          "Martino",
          "Marzi",
          "Masi",
          "Masini",
          "Masoni",
          "Massai",
          "Materassi",
          "Mattei",
          "Matteini",
          "Matteucci",
          "Matteuzzi",
          "Mattioli",
          "Mattolini",
          "Matucci",
          "Mauro",
          "Mazzanti",
          "Mazzei",
          "Mazzetti",
          "Mazzi",
          "Mazzini",
          "Mazzocchi",
          "Mazzoli",
          "Mazzoni",
          "Mazzuoli",
          "Meacci",
          "Mecocci",
          "Meini",
          "Melani",
          "Mele",
          "Meli",
          "Mengoni",
          "Menichetti",
          "Meoni",
          "Merlini",
          "Messeri",
          "Messina",
          "Meucci",
          "Miccinesi",
          "Miceli",
          "Micheli",
          "Michelini",
          "Michelozzi",
          "Migliori",
          "Migliorini",
          "Milani",
          "Miniati",
          "Misuri",
          "Monaco",
          "Montagnani",
          "Montagni",
          "Montanari",
          "Montelatici",
          "Monti",
          "Montigiani",
          "Montini",
          "Morandi",
          "Morandini",
          "Morelli",
          "Moretti",
          "Morganti",
          "Mori",
          "Morini",
          "Moroni",
          "Morozzi",
          "Mugnai",
          "Mugnaini",
          "Mustafa",
          "Naldi",
          "Naldini",
          "Nannelli",
          "Nanni",
          "Nannini",
          "Nannucci",
          "Nardi",
          "Nardini",
          "Nardoni",
          "Natali",
          "Ndiaye",
          "Nencetti",
          "Nencini",
          "Nencioni",
          "Neri",
          "Nesi",
          "Nesti",
          "Niccolai",
          "Niccoli",
          "Niccolini",
          "Nigi",
          "Nistri",
          "Nocentini",
          "Noferini",
          "Novelli",
          "Nucci",
          "Nuti",
          "Nutini",
          "Oliva",
          "Olivieri",
          "Olmi",
          "Orlandi",
          "Orlandini",
          "Orlando",
          "Orsini",
          "Ortolani",
          "Ottanelli",
          "Pacciani",
          "Pace",
          "Paci",
          "Pacini",
          "Pagani",
          "Pagano",
          "Paggetti",
          "Pagliai",
          "Pagni",
          "Pagnini",
          "Paladini",
          "Palagi",
          "Palchetti",
          "Palloni",
          "Palmieri",
          "Palumbo",
          "Pampaloni",
          "Pancani",
          "Pandolfi",
          "Pandolfini",
          "Panerai",
          "Panichi",
          "Paoletti",
          "Paoli",
          "Paolini",
          "Papi",
          "Papini",
          "Papucci",
          "Parenti",
          "Parigi",
          "Parisi",
          "Parri",
          "Parrini",
          "Pasquini",
          "Passeri",
          "Pecchioli",
          "Pecorini",
          "Pellegrini",
          "Pepi",
          "Perini",
          "Perrone",
          "Peruzzi",
          "Pesci",
          "Pestelli",
          "Petri",
          "Petrini",
          "Petrucci",
          "Pettini",
          "Pezzati",
          "Pezzatini",
          "Piani",
          "Piazza",
          "Piazzesi",
          "Piazzini",
          "Piccardi",
          "Picchi",
          "Piccini",
          "Piccioli",
          "Pieraccini",
          "Pieraccioni",
          "Pieralli",
          "Pierattini",
          "Pieri",
          "Pierini",
          "Pieroni",
          "Pietrini",
          "Pini",
          "Pinna",
          "Pinto",
          "Pinzani",
          "Pinzauti",
          "Piras",
          "Pisani",
          "Pistolesi",
          "Poggesi",
          "Poggi",
          "Poggiali",
          "Poggiolini",
          "Poli",
          "Pollastri",
          "Porciani",
          "Pozzi",
          "Pratellesi",
          "Pratesi",
          "Prosperi",
          "Pruneti",
          "Pucci",
          "Puccini",
          "Puccioni",
          "Pugi",
          "Pugliese",
          "Puliti",
          "Querci",
          "Quercioli",
          "Raddi",
          "Radu",
          "Raffaelli",
          "Ragazzini",
          "Ranfagni",
          "Ranieri",
          "Rastrelli",
          "Raugei",
          "Raveggi",
          "Renai",
          "Renzi",
          "Rettori",
          "Ricci",
          "Ricciardi",
          "Ridi",
          "Ridolfi",
          "Rigacci",
          "Righi",
          "Righini",
          "Rinaldi",
          "Risaliti",
          "Ristori",
          "Rizzo",
          "Rocchi",
          "Rocchini",
          "Rogai",
          "Romagnoli",
          "Romanelli",
          "Romani",
          "Romano",
          "Romei",
          "Romeo",
          "Romiti",
          "Romoli",
          "Romolini",
          "Rontini",
          "Rosati",
          "Roselli",
          "Rosi",
          "Rossetti",
          "Rossi",
          "Rossini",
          "Rovai",
          "Ruggeri",
          "Ruggiero",
          "Russo",
          "Sabatini",
          "Saccardi",
          "Sacchetti",
          "Sacchi",
          "Sacco",
          "Salerno",
          "Salimbeni",
          "Salucci",
          "Salvadori",
          "Salvestrini",
          "Salvi",
          "Salvini",
          "Sanesi",
          "Sani",
          "Sanna",
          "Santi",
          "Santini",
          "Santoni",
          "Santoro",
          "Santucci",
          "Sardi",
          "Sarri",
          "Sarti",
          "Sassi",
          "Sbolci",
          "Scali",
          "Scarpelli",
          "Scarselli",
          "Scopetani",
          "Secci",
          "Selvi",
          "Senatori",
          "Senesi",
          "Serafini",
          "Sereni",
          "Serra",
          "Sestini",
          "Sguanci",
          "Sieni",
          "Signorini",
          "Silvestri",
          "Simoncini",
          "Simonetti",
          "Simoni",
          "Singh",
          "Sodi",
          "Soldi",
          "Somigli",
          "Sorbi",
          "Sorelli",
          "Sorrentino",
          "Sottili",
          "Spina",
          "Spinelli",
          "Staccioli",
          "Staderini",
          "Stefanelli",
          "Stefani",
          "Stefanini",
          "Stella",
          "Susini",
          "Tacchi",
          "Tacconi",
          "Taddei",
          "Tagliaferri",
          "Tamburini",
          "Tanganelli",
          "Tani",
          "Tanini",
          "Tapinassi",
          "Tarchi",
          "Tarchiani",
          "Targioni",
          "Tassi",
          "Tassini",
          "Tempesti",
          "Terzani",
          "Tesi",
          "Testa",
          "Testi",
          "Tilli",
          "Tinti",
          "Tirinnanzi",
          "Toccafondi",
          "Tofanari",
          "Tofani",
          "Tognaccini",
          "Tonelli",
          "Tonini",
          "Torelli",
          "Torrini",
          "Tosi",
          "Toti",
          "Tozzi",
          "Trambusti",
          "Trapani",
          "Tucci",
          "Turchi",
          "Ugolini",
          "Ulivi",
          "Valente",
          "Valenti",
          "Valentini",
          "Vangelisti",
          "Vanni",
          "Vannini",
          "Vannoni",
          "Vannozzi",
          "Vannucchi",
          "Vannucci",
          "Ventura",
          "Venturi",
          "Venturini",
          "Vestri",
          "Vettori",
          "Vichi",
          "Viciani",
          "Vieri",
          "Vigiani",
          "Vignoli",
          "Vignolini",
          "Vignozzi",
          "Villani",
          "Vinci",
          "Visani",
          "Vitale",
          "Vitali",
          "Viti",
          "Viviani",
          "Vivoli",
          "Volpe",
          "Volpi",
          "Wang",
          "Wu",
          "Xu",
          "Yang",
          "Ye",
          "Zagli",
          "Zani",
          "Zanieri",
          "Zanobini",
          "Zecchi",
          "Zetti",
          "Zhang",
          "Zheng",
          "Zhou",
          "Zhu",
          "Zingoni",
          "Zini",
          "Zoppi",
        ],
      },
      countries: [
        { name: "Afghanistan", abbreviation: "AF" },
        { name: "Åland Islands", abbreviation: "AX" },
        { name: "Albania", abbreviation: "AL" },
        { name: "Algeria", abbreviation: "DZ" },
        { name: "American Samoa", abbreviation: "AS" },
        { name: "Andorra", abbreviation: "AD" },
        { name: "Angola", abbreviation: "AO" },
        { name: "Anguilla", abbreviation: "AI" },
        { name: "Antarctica", abbreviation: "AQ" },
        { name: "Antigua & Barbuda", abbreviation: "AG" },
        { name: "Argentina", abbreviation: "AR" },
        { name: "Armenia", abbreviation: "AM" },
        { name: "Aruba", abbreviation: "AW" },
        { name: "Ascension Island", abbreviation: "AC" },
        { name: "Australia", abbreviation: "AU" },
        { name: "Austria", abbreviation: "AT" },
        { name: "Azerbaijan", abbreviation: "AZ" },
        { name: "Bahamas", abbreviation: "BS" },
        { name: "Bahrain", abbreviation: "BH" },
        { name: "Bangladesh", abbreviation: "BD" },
        { name: "Barbados", abbreviation: "BB" },
        { name: "Belarus", abbreviation: "BY" },
        { name: "Belgium", abbreviation: "BE" },
        { name: "Belize", abbreviation: "BZ" },
        { name: "Benin", abbreviation: "BJ" },
        { name: "Bermuda", abbreviation: "BM" },
        { name: "Bhutan", abbreviation: "BT" },
        { name: "Bolivia", abbreviation: "BO" },
        { name: "Bosnia & Herzegovina", abbreviation: "BA" },
        { name: "Botswana", abbreviation: "BW" },
        { name: "Brazil", abbreviation: "BR" },
        { name: "British Indian Ocean Territory", abbreviation: "IO" },
        { name: "British Virgin Islands", abbreviation: "VG" },
        { name: "Brunei", abbreviation: "BN" },
        { name: "Bulgaria", abbreviation: "BG" },
        { name: "Burkina Faso", abbreviation: "BF" },
        { name: "Burundi", abbreviation: "BI" },
        { name: "Cambodia", abbreviation: "KH" },
        { name: "Cameroon", abbreviation: "CM" },
        { name: "Canada", abbreviation: "CA" },
        { name: "Canary Islands", abbreviation: "IC" },
        { name: "Cape Verde", abbreviation: "CV" },
        { name: "Caribbean Netherlands", abbreviation: "BQ" },
        { name: "Cayman Islands", abbreviation: "KY" },
        { name: "Central African Republic", abbreviation: "CF" },
        { name: "Ceuta & Melilla", abbreviation: "EA" },
        { name: "Chad", abbreviation: "TD" },
        { name: "Chile", abbreviation: "CL" },
        { name: "China", abbreviation: "CN" },
        { name: "Christmas Island", abbreviation: "CX" },
        { name: "Cocos (Keeling) Islands", abbreviation: "CC" },
        { name: "Colombia", abbreviation: "CO" },
        { name: "Comoros", abbreviation: "KM" },
        { name: "Congo - Brazzaville", abbreviation: "CG" },
        { name: "Congo - Kinshasa", abbreviation: "CD" },
        { name: "Cook Islands", abbreviation: "CK" },
        { name: "Costa Rica", abbreviation: "CR" },
        { name: "Côte d'Ivoire", abbreviation: "CI" },
        { name: "Croatia", abbreviation: "HR" },
        { name: "Cuba", abbreviation: "CU" },
        { name: "Curaçao", abbreviation: "CW" },
        { name: "Cyprus", abbreviation: "CY" },
        { name: "Czech Republic", abbreviation: "CZ" },
        { name: "Denmark", abbreviation: "DK" },
        { name: "Diego Garcia", abbreviation: "DG" },
        { name: "Djibouti", abbreviation: "DJ" },
        { name: "Dominica", abbreviation: "DM" },
        { name: "Dominican Republic", abbreviation: "DO" },
        { name: "Ecuador", abbreviation: "EC" },
        { name: "Egypt", abbreviation: "EG" },
        { name: "El Salvador", abbreviation: "SV" },
        { name: "Equatorial Guinea", abbreviation: "GQ" },
        { name: "Eritrea", abbreviation: "ER" },
        { name: "Estonia", abbreviation: "EE" },
        { name: "Ethiopia", abbreviation: "ET" },
        { name: "Falkland Islands", abbreviation: "FK" },
        { name: "Faroe Islands", abbreviation: "FO" },
        { name: "Fiji", abbreviation: "FJ" },
        { name: "Finland", abbreviation: "FI" },
        { name: "France", abbreviation: "FR" },
        { name: "French Guiana", abbreviation: "GF" },
        { name: "French Polynesia", abbreviation: "PF" },
        { name: "French Southern Territories", abbreviation: "TF" },
        { name: "Gabon", abbreviation: "GA" },
        { name: "Gambia", abbreviation: "GM" },
        { name: "Georgia", abbreviation: "GE" },
        { name: "Germany", abbreviation: "DE" },
        { name: "Ghana", abbreviation: "GH" },
        { name: "Gibraltar", abbreviation: "GI" },
        { name: "Greece", abbreviation: "GR" },
        { name: "Greenland", abbreviation: "GL" },
        { name: "Grenada", abbreviation: "GD" },
        { name: "Guadeloupe", abbreviation: "GP" },
        { name: "Guam", abbreviation: "GU" },
        { name: "Guatemala", abbreviation: "GT" },
        { name: "Guernsey", abbreviation: "GG" },
        { name: "Guinea", abbreviation: "GN" },
        { name: "Guinea-Bissau", abbreviation: "GW" },
        { name: "Guyana", abbreviation: "GY" },
        { name: "Haiti", abbreviation: "HT" },
        { name: "Honduras", abbreviation: "HN" },
        { name: "Hong Kong SAR China", abbreviation: "HK" },
        { name: "Hungary", abbreviation: "HU" },
        { name: "Iceland", abbreviation: "IS" },
        { name: "India", abbreviation: "IN" },
        { name: "Indonesia", abbreviation: "ID" },
        { name: "Iran", abbreviation: "IR" },
        { name: "Iraq", abbreviation: "IQ" },
        { name: "Ireland", abbreviation: "IE" },
        { name: "Isle of Man", abbreviation: "IM" },
        { name: "Israel", abbreviation: "IL" },
        { name: "Italy", abbreviation: "IT" },
        { name: "Jamaica", abbreviation: "JM" },
        { name: "Japan", abbreviation: "JP" },
        { name: "Jersey", abbreviation: "JE" },
        { name: "Jordan", abbreviation: "JO" },
        { name: "Kazakhstan", abbreviation: "KZ" },
        { name: "Kenya", abbreviation: "KE" },
        { name: "Kiribati", abbreviation: "KI" },
        { name: "Kosovo", abbreviation: "XK" },
        { name: "Kuwait", abbreviation: "KW" },
        { name: "Kyrgyzstan", abbreviation: "KG" },
        { name: "Laos", abbreviation: "LA" },
        { name: "Latvia", abbreviation: "LV" },
        { name: "Lebanon", abbreviation: "LB" },
        { name: "Lesotho", abbreviation: "LS" },
        { name: "Liberia", abbreviation: "LR" },
        { name: "Libya", abbreviation: "LY" },
        { name: "Liechtenstein", abbreviation: "LI" },
        { name: "Lithuania", abbreviation: "LT" },
        { name: "Luxembourg", abbreviation: "LU" },
        { name: "Macau SAR China", abbreviation: "MO" },
        { name: "Macedonia", abbreviation: "MK" },
        { name: "Madagascar", abbreviation: "MG" },
        { name: "Malawi", abbreviation: "MW" },
        { name: "Malaysia", abbreviation: "MY" },
        { name: "Maldives", abbreviation: "MV" },
        { name: "Mali", abbreviation: "ML" },
        { name: "Malta", abbreviation: "MT" },
        { name: "Marshall Islands", abbreviation: "MH" },
        { name: "Martinique", abbreviation: "MQ" },
        { name: "Mauritania", abbreviation: "MR" },
        { name: "Mauritius", abbreviation: "MU" },
        { name: "Mayotte", abbreviation: "YT" },
        { name: "Mexico", abbreviation: "MX" },
        { name: "Micronesia", abbreviation: "FM" },
        { name: "Moldova", abbreviation: "MD" },
        { name: "Monaco", abbreviation: "MC" },
        { name: "Mongolia", abbreviation: "MN" },
        { name: "Montenegro", abbreviation: "ME" },
        { name: "Montserrat", abbreviation: "MS" },
        { name: "Morocco", abbreviation: "MA" },
        { name: "Mozambique", abbreviation: "MZ" },
        { name: "Myanmar (Burma)", abbreviation: "MM" },
        { name: "Namibia", abbreviation: "NA" },
        { name: "Nauru", abbreviation: "NR" },
        { name: "Nepal", abbreviation: "NP" },
        { name: "Netherlands", abbreviation: "NL" },
        { name: "New Caledonia", abbreviation: "NC" },
        { name: "New Zealand", abbreviation: "NZ" },
        { name: "Nicaragua", abbreviation: "NI" },
        { name: "Niger", abbreviation: "NE" },
        { name: "Nigeria", abbreviation: "NG" },
        { name: "Niue", abbreviation: "NU" },
        { name: "Norfolk Island", abbreviation: "NF" },
        { name: "North Korea", abbreviation: "KP" },
        { name: "Northern Mariana Islands", abbreviation: "MP" },
        { name: "Norway", abbreviation: "NO" },
        { name: "Oman", abbreviation: "OM" },
        { name: "Pakistan", abbreviation: "PK" },
        { name: "Palau", abbreviation: "PW" },
        { name: "Palestinian Territories", abbreviation: "PS" },
        { name: "Panama", abbreviation: "PA" },
        { name: "Papua New Guinea", abbreviation: "PG" },
        { name: "Paraguay", abbreviation: "PY" },
        { name: "Peru", abbreviation: "PE" },
        { name: "Philippines", abbreviation: "PH" },
        { name: "Pitcairn Islands", abbreviation: "PN" },
        { name: "Poland", abbreviation: "PL" },
        { name: "Portugal", abbreviation: "PT" },
        { name: "Puerto Rico", abbreviation: "PR" },
        { name: "Qatar", abbreviation: "QA" },
        { name: "Réunion", abbreviation: "RE" },
        { name: "Romania", abbreviation: "RO" },
        { name: "Russia", abbreviation: "RU" },
        { name: "Rwanda", abbreviation: "RW" },
        { name: "Samoa", abbreviation: "WS" },
        { name: "San Marino", abbreviation: "SM" },
        { name: "São Tomé and Príncipe", abbreviation: "ST" },
        { name: "Saudi Arabia", abbreviation: "SA" },
        { name: "Senegal", abbreviation: "SN" },
        { name: "Serbia", abbreviation: "RS" },
        { name: "Seychelles", abbreviation: "SC" },
        { name: "Sierra Leone", abbreviation: "SL" },
        { name: "Singapore", abbreviation: "SG" },
        { name: "Sint Maarten", abbreviation: "SX" },
        { name: "Slovakia", abbreviation: "SK" },
        { name: "Slovenia", abbreviation: "SI" },
        { name: "Solomon Islands", abbreviation: "SB" },
        { name: "Somalia", abbreviation: "SO" },
        { name: "South Africa", abbreviation: "ZA" },
        { name: "South Georgia & South Sandwich Islands", abbreviation: "GS" },
        { name: "South Korea", abbreviation: "KR" },
        { name: "South Sudan", abbreviation: "SS" },
        { name: "Spain", abbreviation: "ES" },
        { name: "Sri Lanka", abbreviation: "LK" },
        { name: "St. Barthélemy", abbreviation: "BL" },
        { name: "St. Helena", abbreviation: "SH" },
        { name: "St. Kitts & Nevis", abbreviation: "KN" },
        { name: "St. Lucia", abbreviation: "LC" },
        { name: "St. Martin", abbreviation: "MF" },
        { name: "St. Pierre & Miquelon", abbreviation: "PM" },
        { name: "St. Vincent & Grenadines", abbreviation: "VC" },
        { name: "Sudan", abbreviation: "SD" },
        { name: "Suriname", abbreviation: "SR" },
        { name: "Svalbard & Jan Mayen", abbreviation: "SJ" },
        { name: "Swaziland", abbreviation: "SZ" },
        { name: "Sweden", abbreviation: "SE" },
        { name: "Switzerland", abbreviation: "CH" },
        { name: "Syria", abbreviation: "SY" },
        { name: "Taiwan", abbreviation: "TW" },
        { name: "Tajikistan", abbreviation: "TJ" },
        { name: "Tanzania", abbreviation: "TZ" },
        { name: "Thailand", abbreviation: "TH" },
        { name: "Timor-Leste", abbreviation: "TL" },
        { name: "Togo", abbreviation: "TG" },
        { name: "Tokelau", abbreviation: "TK" },
        { name: "Tonga", abbreviation: "TO" },
        { name: "Trinidad & Tobago", abbreviation: "TT" },
        { name: "Tristan da Cunha", abbreviation: "TA" },
        { name: "Tunisia", abbreviation: "TN" },
        { name: "Turkey", abbreviation: "TR" },
        { name: "Turkmenistan", abbreviation: "TM" },
        { name: "Turks & Caicos Islands", abbreviation: "TC" },
        { name: "Tuvalu", abbreviation: "TV" },
        { name: "U.S. Outlying Islands", abbreviation: "UM" },
        { name: "U.S. Virgin Islands", abbreviation: "VI" },
        { name: "Uganda", abbreviation: "UG" },
        { name: "Ukraine", abbreviation: "UA" },
        { name: "United Arab Emirates", abbreviation: "AE" },
        { name: "United Kingdom", abbreviation: "GB" },
        { name: "United States", abbreviation: "US" },
        { name: "Uruguay", abbreviation: "UY" },
        { name: "Uzbekistan", abbreviation: "UZ" },
        { name: "Vanuatu", abbreviation: "VU" },
        { name: "Vatican City", abbreviation: "VA" },
        { name: "Venezuela", abbreviation: "VE" },
        { name: "Vietnam", abbreviation: "VN" },
        { name: "Wallis & Futuna", abbreviation: "WF" },
        { name: "Western Sahara", abbreviation: "EH" },
        { name: "Yemen", abbreviation: "YE" },
        { name: "Zambia", abbreviation: "ZM" },
        { name: "Zimbabwe", abbreviation: "ZW" },
      ],
      counties: {
        uk: [
          { name: "Bath and North East Somerset" },
          { name: "Bedford" },
          { name: "Blackburn with Darwen" },
          { name: "Blackpool" },
          { name: "Bournemouth" },
          { name: "Bracknell Forest" },
          { name: "Brighton & Hove" },
          { name: "Bristol" },
          { name: "Buckinghamshire" },
          { name: "Cambridgeshire" },
          { name: "Central Bedfordshire" },
          {
            name: "Cheshire East",
          },
          { name: "Cheshire West and Chester" },
          { name: "Cornwall" },
          { name: "County Durham" },
          { name: "Cumbria" },
          { name: "Darlington" },
          { name: "Derby" },
          { name: "Derbyshire" },
          { name: "Devon" },
          { name: "Dorset" },
          { name: "East Riding of Yorkshire" },
          { name: "East Sussex" },
          { name: "Essex" },
          { name: "Gloucestershire" },
          { name: "Greater London" },
          { name: "Greater Manchester" },
          { name: "Halton" },
          { name: "Hampshire" },
          { name: "Hartlepool" },
          { name: "Herefordshire" },
          { name: "Hertfordshire" },
          { name: "Hull" },
          { name: "Isle of Wight" },
          { name: "Isles of Scilly" },
          { name: "Kent" },
          { name: "Lancashire" },
          { name: "Leicester" },
          { name: "Leicestershire" },
          { name: "Lincolnshire" },
          { name: "Luton" },
          { name: "Medway" },
          { name: "Merseyside" },
          { name: "Middlesbrough" },
          { name: "Milton Keynes" },
          { name: "Norfolk" },
          { name: "North East Lincolnshire" },
          { name: "North Lincolnshire" },
          { name: "North Somerset" },
          { name: "North Yorkshire" },
          { name: "Northamptonshire" },
          { name: "Northumberland" },
          { name: "Nottingham" },
          { name: "Nottinghamshire" },
          { name: "Oxfordshire" },
          { name: "Peterborough" },
          { name: "Plymouth" },
          { name: "Poole" },
          { name: "Portsmouth" },
          { name: "Reading" },
          { name: "Redcar and Cleveland" },
          { name: "Rutland" },
          { name: "Shropshire" },
          { name: "Slough" },
          { name: "Somerset" },
          { name: "South Gloucestershire" },
          { name: "South Yorkshire" },
          { name: "Southampton" },
          { name: "Southend-on-Sea" },
          { name: "Staffordshire" },
          { name: "Stockton-on-Tees" },
          { name: "Stoke-on-Trent" },
          { name: "Suffolk" },
          { name: "Surrey" },
          { name: "Swindon" },
          { name: "Telford and Wrekin" },
          { name: "Thurrock" },
          { name: "Torbay" },
          { name: "Tyne and Wear" },
          { name: "Warrington" },
          { name: "Warwickshire" },
          { name: "West Berkshire" },
          { name: "West Midlands" },
          { name: "West Sussex" },
          { name: "West Yorkshire" },
          { name: "Wiltshire" },
          { name: "Windsor and Maidenhead" },
          { name: "Wokingham" },
          { name: "Worcestershire" },
          { name: "York" },
        ],
      },
      provinces: {
        ca: [
          { name: "Alberta", abbreviation: "AB" },
          { name: "British Columbia", abbreviation: "BC" },
          { name: "Manitoba", abbreviation: "MB" },
          { name: "New Brunswick", abbreviation: "NB" },
          { name: "Newfoundland and Labrador", abbreviation: "NL" },
          { name: "Nova Scotia", abbreviation: "NS" },
          { name: "Ontario", abbreviation: "ON" },
          { name: "Prince Edward Island", abbreviation: "PE" },
          { name: "Quebec", abbreviation: "QC" },
          { name: "Saskatchewan", abbreviation: "SK" },
          { name: "Northwest Territories", abbreviation: "NT" },
          { name: "Nunavut", abbreviation: "NU" },
          { name: "Yukon", abbreviation: "YT" },
        ],
        it: [
          { name: "Agrigento", abbreviation: "AG", code: 84 },
          { name: "Alessandria", abbreviation: "AL", code: 6 },
          { name: "Ancona", abbreviation: "AN", code: 42 },
          { name: "Aosta", abbreviation: "AO", code: 7 },
          { name: "L'Aquila", abbreviation: "AQ", code: 66 },
          { name: "Arezzo", abbreviation: "AR", code: 51 },
          { name: "Ascoli-Piceno", abbreviation: "AP", code: 44 },
          { name: "Asti", abbreviation: "AT", code: 5 },
          { name: "Avellino", abbreviation: "AV", code: 64 },
          { name: "Bari", abbreviation: "BA", code: 72 },
          { name: "Barletta-Andria-Trani", abbreviation: "BT", code: 72 },
          { name: "Belluno", abbreviation: "BL", code: 25 },
          { name: "Benevento", abbreviation: "BN", code: 62 },
          { name: "Bergamo", abbreviation: "BG", code: 16 },
          { name: "Biella", abbreviation: "BI", code: 96 },
          { name: "Bologna", abbreviation: "BO", code: 37 },
          { name: "Bolzano", abbreviation: "BZ", code: 21 },
          { name: "Brescia", abbreviation: "BS", code: 17 },
          { name: "Brindisi", abbreviation: "BR", code: 74 },
          { name: "Cagliari", abbreviation: "CA", code: 92 },
          { name: "Caltanissetta", abbreviation: "CL", code: 85 },
          { name: "Campobasso", abbreviation: "CB", code: 70 },
          { name: "Carbonia Iglesias", abbreviation: "CI", code: 70 },
          { name: "Caserta", abbreviation: "CE", code: 61 },
          { name: "Catania", abbreviation: "CT", code: 87 },
          { name: "Catanzaro", abbreviation: "CZ", code: 79 },
          { name: "Chieti", abbreviation: "CH", code: 69 },
          { name: "Como", abbreviation: "CO", code: 13 },
          { name: "Cosenza", abbreviation: "CS", code: 78 },
          { name: "Cremona", abbreviation: "CR", code: 19 },
          { name: "Crotone", abbreviation: "KR", code: 101 },
          { name: "Cuneo", abbreviation: "CN", code: 4 },
          { name: "Enna", abbreviation: "EN", code: 86 },
          { name: "Fermo", abbreviation: "FM", code: 86 },
          { name: "Ferrara", abbreviation: "FE", code: 38 },
          { name: "Firenze", abbreviation: "FI", code: 48 },
          { name: "Foggia", abbreviation: "FG", code: 71 },
          { name: "Forli-Cesena", abbreviation: "FC", code: 71 },
          { name: "Frosinone", abbreviation: "FR", code: 60 },
          { name: "Genova", abbreviation: "GE", code: 10 },
          { name: "Gorizia", abbreviation: "GO", code: 31 },
          { name: "Grosseto", abbreviation: "GR", code: 53 },
          { name: "Imperia", abbreviation: "IM", code: 8 },
          { name: "Isernia", abbreviation: "IS", code: 94 },
          { name: "La-Spezia", abbreviation: "SP", code: 66 },
          { name: "Latina", abbreviation: "LT", code: 59 },
          { name: "Lecce", abbreviation: "LE", code: 75 },
          { name: "Lecco", abbreviation: "LC", code: 97 },
          { name: "Livorno", abbreviation: "LI", code: 49 },
          { name: "Lodi", abbreviation: "LO", code: 98 },
          { name: "Lucca", abbreviation: "LU", code: 46 },
          { name: "Macerata", abbreviation: "MC", code: 43 },
          { name: "Mantova", abbreviation: "MN", code: 20 },
          { name: "Massa-Carrara", abbreviation: "MS", code: 45 },
          { name: "Matera", abbreviation: "MT", code: 77 },
          { name: "Medio Campidano", abbreviation: "VS", code: 77 },
          { name: "Messina", abbreviation: "ME", code: 83 },
          { name: "Milano", abbreviation: "MI", code: 15 },
          { name: "Modena", abbreviation: "MO", code: 36 },
          { name: "Monza-Brianza", abbreviation: "MB", code: 36 },
          { name: "Napoli", abbreviation: "NA", code: 63 },
          { name: "Novara", abbreviation: "NO", code: 3 },
          { name: "Nuoro", abbreviation: "NU", code: 91 },
          { name: "Ogliastra", abbreviation: "OG", code: 91 },
          { name: "Olbia Tempio", abbreviation: "OT", code: 91 },
          { name: "Oristano", abbreviation: "OR", code: 95 },
          { name: "Padova", abbreviation: "PD", code: 28 },
          { name: "Palermo", abbreviation: "PA", code: 82 },
          { name: "Parma", abbreviation: "PR", code: 34 },
          { name: "Pavia", abbreviation: "PV", code: 18 },
          { name: "Perugia", abbreviation: "PG", code: 54 },
          { name: "Pesaro-Urbino", abbreviation: "PU", code: 41 },
          { name: "Pescara", abbreviation: "PE", code: 68 },
          { name: "Piacenza", abbreviation: "PC", code: 33 },
          { name: "Pisa", abbreviation: "PI", code: 50 },
          { name: "Pistoia", abbreviation: "PT", code: 47 },
          { name: "Pordenone", abbreviation: "PN", code: 93 },
          { name: "Potenza", abbreviation: "PZ", code: 76 },
          { name: "Prato", abbreviation: "PO", code: 100 },
          { name: "Ragusa", abbreviation: "RG", code: 88 },
          { name: "Ravenna", abbreviation: "RA", code: 39 },
          { name: "Reggio-Calabria", abbreviation: "RC", code: 35 },
          { name: "Reggio-Emilia", abbreviation: "RE", code: 35 },
          { name: "Rieti", abbreviation: "RI", code: 57 },
          { name: "Rimini", abbreviation: "RN", code: 99 },
          { name: "Roma", abbreviation: "Roma", code: 58 },
          { name: "Rovigo", abbreviation: "RO", code: 29 },
          { name: "Salerno", abbreviation: "SA", code: 65 },
          { name: "Sassari", abbreviation: "SS", code: 90 },
          { name: "Savona", abbreviation: "SV", code: 9 },
          { name: "Siena", abbreviation: "SI", code: 52 },
          { name: "Siracusa", abbreviation: "SR", code: 89 },
          { name: "Sondrio", abbreviation: "SO", code: 14 },
          { name: "Taranto", abbreviation: "TA", code: 73 },
          { name: "Teramo", abbreviation: "TE", code: 67 },
          { name: "Terni", abbreviation: "TR", code: 55 },
          { name: "Torino", abbreviation: "TO", code: 1 },
          { name: "Trapani", abbreviation: "TP", code: 81 },
          { name: "Trento", abbreviation: "TN", code: 22 },
          { name: "Treviso", abbreviation: "TV", code: 26 },
          { name: "Trieste", abbreviation: "TS", code: 32 },
          { name: "Udine", abbreviation: "UD", code: 30 },
          { name: "Varese", abbreviation: "VA", code: 12 },
          { name: "Venezia", abbreviation: "VE", code: 27 },
          { name: "Verbania", abbreviation: "VB", code: 27 },
          { name: "Vercelli", abbreviation: "VC", code: 2 },
          { name: "Verona", abbreviation: "VR", code: 23 },
          { name: "Vibo-Valentia", abbreviation: "VV", code: 102 },
          { name: "Vicenza", abbreviation: "VI", code: 24 },
          { name: "Viterbo", abbreviation: "VT", code: 56 },
        ],
      },
      nationalities: [
        { name: "Afghan" },
        { name: "Albanian" },
        { name: "Algerian" },
        { name: "American" },
        { name: "Andorran" },
        { name: "Angolan" },
        { name: "Antiguans" },
        { name: "Argentinean" },
        { name: "Armenian" },
        { name: "Australian" },
        { name: "Austrian" },
        { name: "Azerbaijani" },
        { name: "Bahami" },
        { name: "Bahraini" },
        { name: "Bangladeshi" },
        { name: "Barbadian" },
        { name: "Barbudans" },
        { name: "Batswana" },
        { name: "Belarusian" },
        { name: "Belgian" },
        { name: "Belizean" },
        { name: "Beninese" },
        { name: "Bhutanese" },
        { name: "Bolivian" },
        { name: "Bosnian" },
        { name: "Brazilian" },
        { name: "British" },
        { name: "Bruneian" },
        { name: "Bulgarian" },
        { name: "Burkinabe" },
        { name: "Burmese" },
        { name: "Burundian" },
        { name: "Cambodian" },
        { name: "Cameroonian" },
        { name: "Canadian" },
        { name: "Cape Verdean" },
        { name: "Central African" },
        { name: "Chadian" },
        { name: "Chilean" },
        { name: "Chinese" },
        { name: "Colombian" },
        { name: "Comoran" },
        { name: "Congolese" },
        { name: "Costa Rican" },
        { name: "Croatian" },
        { name: "Cuban" },
        { name: "Cypriot" },
        { name: "Czech" },
        { name: "Danish" },
        { name: "Djibouti" },
        { name: "Dominican" },
        { name: "Dutch" },
        { name: "East Timorese" },
        { name: "Ecuadorean" },
        { name: "Egyptian" },
        { name: "Emirian" },
        { name: "Equatorial Guinean" },
        { name: "Eritrean" },
        { name: "Estonian" },
        { name: "Ethiopian" },
        { name: "Fijian" },
        { name: "Filipino" },
        { name: "Finnish" },
        { name: "French" },
        { name: "Gabonese" },
        { name: "Gambian" },
        { name: "Georgian" },
        { name: "German" },
        { name: "Ghanaian" },
        { name: "Greek" },
        { name: "Grenadian" },
        { name: "Guatemalan" },
        { name: "Guinea-Bissauan" },
        { name: "Guinean" },
        { name: "Guyanese" },
        { name: "Haitian" },
        { name: "Herzegovinian" },
        { name: "Honduran" },
        { name: "Hungarian" },
        { name: "I-Kiribati" },
        { name: "Icelander" },
        { name: "Indian" },
        { name: "Indonesian" },
        { name: "Iranian" },
        { name: "Iraqi" },
        { name: "Irish" },
        { name: "Israeli" },
        { name: "Italian" },
        { name: "Ivorian" },
        { name: "Jamaican" },
        { name: "Japanese" },
        { name: "Jordanian" },
        { name: "Kazakhstani" },
        { name: "Kenyan" },
        { name: "Kittian and Nevisian" },
        { name: "Kuwaiti" },
        { name: "Kyrgyz" },
        { name: "Laotian" },
        { name: "Latvian" },
        { name: "Lebanese" },
        { name: "Liberian" },
        { name: "Libyan" },
        { name: "Liechtensteiner" },
        { name: "Lithuanian" },
        { name: "Luxembourger" },
        { name: "Macedonian" },
        { name: "Malagasy" },
        { name: "Malawian" },
        { name: "Malaysian" },
        { name: "Maldivan" },
        { name: "Malian" },
        { name: "Maltese" },
        { name: "Marshallese" },
        { name: "Mauritanian" },
        { name: "Mauritian" },
        { name: "Mexican" },
        { name: "Micronesian" },
        { name: "Moldovan" },
        { name: "Monacan" },
        { name: "Mongolian" },
        { name: "Moroccan" },
        { name: "Mosotho" },
        { name: "Motswana" },
        { name: "Mozambican" },
        { name: "Namibian" },
        { name: "Nauruan" },
        { name: "Nepalese" },
        { name: "New Zealander" },
        { name: "Nicaraguan" },
        { name: "Nigerian" },
        { name: "Nigerien" },
        { name: "North Korean" },
        { name: "Northern Irish" },
        { name: "Norwegian" },
        { name: "Omani" },
        { name: "Pakistani" },
        { name: "Palauan" },
        { name: "Panamanian" },
        { name: "Papua New Guinean" },
        { name: "Paraguayan" },
        { name: "Peruvian" },
        { name: "Polish" },
        { name: "Portuguese" },
        { name: "Qatari" },
        { name: "Romani" },
        { name: "Russian" },
        { name: "Rwandan" },
        { name: "Saint Lucian" },
        { name: "Salvadoran" },
        { name: "Samoan" },
        { name: "San Marinese" },
        { name: "Sao Tomean" },
        { name: "Saudi" },
        { name: "Scottish" },
        { name: "Senegalese" },
        { name: "Serbian" },
        { name: "Seychellois" },
        { name: "Sierra Leonean" },
        { name: "Singaporean" },
        { name: "Slovakian" },
        { name: "Slovenian" },
        { name: "Solomon Islander" },
        { name: "Somali" },
        { name: "South African" },
        { name: "South Korean" },
        { name: "Spanish" },
        { name: "Sri Lankan" },
        { name: "Sudanese" },
        { name: "Surinamer" },
        { name: "Swazi" },
        { name: "Swedish" },
        { name: "Swiss" },
        { name: "Syrian" },
        { name: "Taiwanese" },
        { name: "Tajik" },
        { name: "Tanzanian" },
        { name: "Thai" },
        { name: "Togolese" },
        { name: "Tongan" },
        { name: "Trinidadian or Tobagonian" },
        { name: "Tunisian" },
        { name: "Turkish" },
        { name: "Tuvaluan" },
        { name: "Ugandan" },
        { name: "Ukrainian" },
        { name: "Uruguaya" },
        { name: "Uzbekistani" },
        { name: "Venezuela" },
        { name: "Vietnamese" },
        { name: "Wels" },
        { name: "Yemenit" },
        { name: "Zambia" },
        { name: "Zimbabwe" },
      ],
      us_states_and_dc: [
        { name: "Alabama", abbreviation: "AL" },
        { name: "Alaska", abbreviation: "AK" },
        { name: "Arizona", abbreviation: "AZ" },
        { name: "Arkansas", abbreviation: "AR" },
        { name: "California", abbreviation: "CA" },
        { name: "Colorado", abbreviation: "CO" },
        { name: "Connecticut", abbreviation: "CT" },
        { name: "Delaware", abbreviation: "DE" },
        { name: "District of Columbia", abbreviation: "DC" },
        { name: "Florida", abbreviation: "FL" },
        { name: "Georgia", abbreviation: "GA" },
        { name: "Hawaii", abbreviation: "HI" },
        { name: "Idaho", abbreviation: "ID" },
        { name: "Illinois", abbreviation: "IL" },
        { name: "Indiana", abbreviation: "IN" },
        { name: "Iowa", abbreviation: "IA" },
        { name: "Kansas", abbreviation: "KS" },
        { name: "Kentucky", abbreviation: "KY" },
        { name: "Louisiana", abbreviation: "LA" },
        { name: "Maine", abbreviation: "ME" },
        { name: "Maryland", abbreviation: "MD" },
        { name: "Massachusetts", abbreviation: "MA" },
        { name: "Michigan", abbreviation: "MI" },
        { name: "Minnesota", abbreviation: "MN" },
        { name: "Mississippi", abbreviation: "MS" },
        { name: "Missouri", abbreviation: "MO" },
        { name: "Montana", abbreviation: "MT" },
        { name: "Nebraska", abbreviation: "NE" },
        { name: "Nevada", abbreviation: "NV" },
        { name: "New Hampshire", abbreviation: "NH" },
        { name: "New Jersey", abbreviation: "NJ" },
        { name: "New Mexico", abbreviation: "NM" },
        { name: "New York", abbreviation: "NY" },
        { name: "North Carolina", abbreviation: "NC" },
        { name: "North Dakota", abbreviation: "ND" },
        { name: "Ohio", abbreviation: "OH" },
        { name: "Oklahoma", abbreviation: "OK" },
        { name: "Oregon", abbreviation: "OR" },
        { name: "Pennsylvania", abbreviation: "PA" },
        { name: "Rhode Island", abbreviation: "RI" },
        { name: "South Carolina", abbreviation: "SC" },
        { name: "South Dakota", abbreviation: "SD" },
        { name: "Tennessee", abbreviation: "TN" },
        { name: "Texas", abbreviation: "TX" },
        { name: "Utah", abbreviation: "UT" },
        { name: "Vermont", abbreviation: "VT" },
        { name: "Virginia", abbreviation: "VA" },
        { name: "Washington", abbreviation: "WA" },
        { name: "West Virginia", abbreviation: "WV" },
        { name: "Wisconsin", abbreviation: "WI" },
        { name: "Wyoming", abbreviation: "WY" },
      ],
      territories: [
        { name: "American Samoa", abbreviation: "AS" },
        { name: "Federated States of Micronesia", abbreviation: "FM" },
        { name: "Guam", abbreviation: "GU" },
        { name: "Marshall Islands", abbreviation: "MH" },
        { name: "Northern Mariana Islands", abbreviation: "MP" },
        { name: "Puerto Rico", abbreviation: "PR" },
        { name: "Virgin Islands, U.S.", abbreviation: "VI" },
      ],
      armed_forces: [
        { name: "Armed Forces Europe", abbreviation: "AE" },
        { name: "Armed Forces Pacific", abbreviation: "AP" },
        { name: "Armed Forces the Americas", abbreviation: "AA" },
      ],
      country_regions: {
        it: [
          { name: "Valle d'Aosta", abbreviation: "VDA" },
          { name: "Piemonte", abbreviation: "PIE" },
          { name: "Lombardia", abbreviation: "LOM" },
          { name: "Veneto", abbreviation: "VEN" },
          { name: "Trentino Alto Adige", abbreviation: "TAA" },
          { name: "Friuli Venezia Giulia", abbreviation: "FVG" },
          { name: "Liguria", abbreviation: "LIG" },
          { name: "Emilia Romagna", abbreviation: "EMR" },
          { name: "Toscana", abbreviation: "TOS" },
          { name: "Umbria", abbreviation: "UMB" },
          { name: "Marche", abbreviation: "MAR" },
          { name: "Abruzzo", abbreviation: "ABR" },
          { name: "Lazio", abbreviation: "LAZ" },
          { name: "Campania", abbreviation: "CAM" },
          { name: "Puglia", abbreviation: "PUG" },
          { name: "Basilicata", abbreviation: "BAS" },
          { name: "Molise", abbreviation: "MOL" },
          { name: "Calabria", abbreviation: "CAL" },
          { name: "Sicilia", abbreviation: "SIC" },
          { name: "Sardegna", abbreviation: "SAR" },
        ],
      },
      street_suffixes: {
        us: [
          { name: "Avenue", abbreviation: "Ave" },
          { name: "Boulevard", abbreviation: "Blvd" },
          { name: "Center", abbreviation: "Ctr" },
          { name: "Circle", abbreviation: "Cir" },
          { name: "Court", abbreviation: "Ct" },
          { name: "Drive", abbreviation: "Dr" },
          { name: "Extension", abbreviation: "Ext" },
          { name: "Glen", abbreviation: "Gln" },
          { name: "Grove", abbreviation: "Grv" },
          { name: "Heights", abbreviation: "Hts" },
          { name: "Highway", abbreviation: "Hwy" },
          { name: "Junction", abbreviation: "Jct" },
          { name: "Key", abbreviation: "Key" },
          { name: "Lane", abbreviation: "Ln" },
          { name: "Loop", abbreviation: "Loop" },
          { name: "Manor", abbreviation: "Mnr" },
          { name: "Mill", abbreviation: "Mill" },
          { name: "Park", abbreviation: "Park" },
          { name: "Parkway", abbreviation: "Pkwy" },
          { name: "Pass", abbreviation: "Pass" },
          { name: "Path", abbreviation: "Path" },
          { name: "Pike", abbreviation: "Pike" },
          { name: "Place", abbreviation: "Pl" },
          { name: "Plaza", abbreviation: "Plz" },
          { name: "Point", abbreviation: "Pt" },
          { name: "Ridge", abbreviation: "Rdg" },
          { name: "River", abbreviation: "Riv" },
          { name: "Road", abbreviation: "Rd" },
          { name: "Square", abbreviation: "Sq" },
          { name: "Street", abbreviation: "St" },
          { name: "Terrace", abbreviation: "Ter" },
          { name: "Trail", abbreviation: "Trl" },
          { name: "Turnpike", abbreviation: "Tpke" },
          { name: "View", abbreviation: "Vw" },
          { name: "Way", abbreviation: "Way" },
        ],
        it: [
          { name: "Accesso", abbreviation: "Acc." },
          { name: "Alzaia", abbreviation: "Alz." },
          { name: "Arco", abbreviation: "Arco" },
          { name: "Archivolto", abbreviation: "Acv." },
          { name: "Arena", abbreviation: "Arena" },
          { name: "Argine", abbreviation: "Argine" },
          { name: "Bacino", abbreviation: "Bacino" },
          { name: "Banchi", abbreviation: "Banchi" },
          { name: "Banchina", abbreviation: "Ban." },
          { name: "Bastioni", abbreviation: "Bas." },
          { name: "Belvedere", abbreviation: "Belv." },
          { name: "Borgata", abbreviation: "B.ta" },
          { name: "Borgo", abbreviation: "B.go" },
          { name: "Calata", abbreviation: "Cal." },
          { name: "Calle", abbreviation: "Calle" },
          { name: "Campiello", abbreviation: "Cam." },
          { name: "Campo", abbreviation: "Cam." },
          { name: "Canale", abbreviation: "Can." },
          { name: "Carraia", abbreviation: "Carr." },
          { name: "Cascina", abbreviation: "Cascina" },
          { name: "Case sparse", abbreviation: "c.s." },
          { name: "Cavalcavia", abbreviation: "Cv." },
          { name: "Circonvallazione", abbreviation: "Cv." },
          { name: "Complanare", abbreviation: "C.re" },
          { name: "Contrada", abbreviation: "C.da" },
          { name: "Corso", abbreviation: "C.so" },
          { name: "Corte", abbreviation: "C.te" },
          { name: "Cortile", abbreviation: "C.le" },
          { name: "Diramazione", abbreviation: "Dir." },
          { name: "Fondaco", abbreviation: "F.co" },
          { name: "Fondamenta", abbreviation: "F.ta" },
          { name: "Fondo", abbreviation: "F.do" },
          { name: "Frazione", abbreviation: "Fr." },
          { name: "Isola", abbreviation: "Is." },
          { name: "Largo", abbreviation: "L.go" },
          { name: "Litoranea", abbreviation: "Lit." },
          { name: "Lungolago", abbreviation: "L.go lago" },
          { name: "Lungo Po", abbreviation: "l.go Po" },
          { name: "Molo", abbreviation: "Molo" },
          { name: "Mura", abbreviation: "Mura" },
          { name: "Passaggio privato", abbreviation: "pass. priv." },
          { name: "Passeggiata", abbreviation: "Pass." },
          { name: "Piazza", abbreviation: "P.zza" },
          { name: "Piazzale", abbreviation: "P.le" },
          { name: "Ponte", abbreviation: "P.te" },
          { name: "Portico", abbreviation: "P.co" },
          { name: "Rampa", abbreviation: "Rampa" },
          { name: "Regione", abbreviation: "Reg." },
          { name: "Rione", abbreviation: "R.ne" },
          { name: "Rio", abbreviation: "Rio" },
          { name: "Ripa", abbreviation: "Ripa" },
          { name: "Riva", abbreviation: "Riva" },
          { name: "Rondò", abbreviation: "Rondò" },
          { name: "Rotonda", abbreviation: "Rot." },
          { name: "Sagrato", abbreviation: "Sagr." },
          { name: "Salita", abbreviation: "Sal." },
          { name: "Scalinata", abbreviation: "Scal." },
          { name: "Scalone", abbreviation: "Scal." },
          { name: "Slargo", abbreviation: "Sl." },
          { name: "Sottoportico", abbreviation: "Sott." },
          { name: "Strada", abbreviation: "Str." },
          { name: "Stradale", abbreviation: "Str.le" },
          { name: "Strettoia", abbreviation: "Strett." },
          { name: "Traversa", abbreviation: "Trav." },
          { name: "Via", abbreviation: "V." },
          { name: "Viale", abbreviation: "V.le" },
          { name: "Vicinale", abbreviation: "Vic.le" },
          { name: "Vicolo", abbreviation: "Vic." },
        ],
      },
      months: [
        { name: "January", short_name: "Jan", numeric: "01", days: 31 },
        { name: "February", short_name: "Feb", numeric: "02", days: 28 },
        { name: "March", short_name: "Mar", numeric: "03", days: 31 },
        { name: "April", short_name: "Apr", numeric: "04", days: 30 },
        { name: "May", short_name: "May", numeric: "05", days: 31 },
        { name: "June", short_name: "Jun", numeric: "06", days: 30 },
        { name: "July", short_name: "Jul", numeric: "07", days: 31 },
        { name: "August", short_name: "Aug", numeric: "08", days: 31 },
        { name: "September", short_name: "Sep", numeric: "09", days: 30 },
        { name: "October", short_name: "Oct", numeric: "10", days: 31 },
        { name: "November", short_name: "Nov", numeric: "11", days: 30 },
        { name: "December", short_name: "Dec", numeric: "12", days: 31 },
      ],
      cc_types: [
        {
          name: "American Express",
          short_name: "amex",
          prefix: "34",
          length: 15,
        },
        {
          name: "Bankcard",
          short_name: "bankcard",
          prefix: "5610",
          length: 16,
        },
        {
          name: "China UnionPay",
          short_name: "chinaunion",
          prefix: "62",
          length: 16,
        },
        {
          name: "Diners Club Carte Blanche",
          short_name: "dccarte",
          prefix: "300",
          length: 14,
        },
        {
          name: "Diners Club enRoute",
          short_name: "dcenroute",
          prefix: "2014",
          length: 15,
        },
        {
          name: "Diners Club International",
          short_name: "dcintl",
          prefix: "36",
          length: 14,
        },
        {
          name: "Diners Club United States & Canada",
          short_name: "dcusc",
          prefix: "54",
          length: 16,
        },
        {
          name: "Discover Card",
          short_name: "discover",
          prefix: "6011",
          length: 16,
        },
        {
          name: "InstaPayment",
          short_name: "instapay",
          prefix: "637",
          length: 16,
        },
        { name: "JCB", short_name: "jcb", prefix: "3528", length: 16 },
        { name: "Laser", short_name: "laser", prefix: "6304", length: 16 },
        { name: "Maestro", short_name: "maestro", prefix: "5018", length: 16 },
        { name: "Mastercard", short_name: "mc", prefix: "51", length: 16 },
        { name: "Solo", short_name: "solo", prefix: "6334", length: 16 },
        { name: "Switch", short_name: "switch", prefix: "4903", length: 16 },
        { name: "Visa", short_name: "visa", prefix: "4", length: 16 },
        {
          name: "Visa Electron",
          short_name: "electron",
          prefix: "4026",
          length: 16,
        },
      ],
      currency_types: [
        { code: "AED", name: "United Arab Emirates Dirham" },
        { code: "AFN", name: "Afghanistan Afghani" },
        { code: "ALL", name: "Albania Lek" },
        { code: "AMD", name: "Armenia Dram" },
        { code: "ANG", name: "Netherlands Antilles Guilder" },
        { code: "AOA", name: "Angola Kwanza" },
        { code: "ARS", name: "Argentina Peso" },
        { code: "AUD", name: "Australia Dollar" },
        { code: "AWG", name: "Aruba Guilder" },
        { code: "AZN", name: "Azerbaijan New Manat" },
        { code: "BAM", name: "Bosnia and Herzegovina Convertible Marka" },
        { code: "BBD", name: "Barbados Dollar" },
        { code: "BDT", name: "Bangladesh Taka" },
        { code: "BGN", name: "Bulgaria Lev" },
        { code: "BHD", name: "Bahrain Dinar" },
        { code: "BIF", name: "Burundi Franc" },
        { code: "BMD", name: "Bermuda Dollar" },
        { code: "BND", name: "Brunei Darussalam Dollar" },
        { code: "BOB", name: "Bolivia Boliviano" },
        { code: "BRL", name: "Brazil Real" },
        { code: "BSD", name: "Bahamas Dollar" },
        { code: "BTN", name: "Bhutan Ngultrum" },
        { code: "BWP", name: "Botswana Pula" },
        { code: "BYR", name: "Belarus Ruble" },
        { code: "BZD", name: "Belize Dollar" },
        { code: "CAD", name: "Canada Dollar" },
        { code: "CDF", name: "Congo/Kinshasa Franc" },
        { code: "CHF", name: "Switzerland Franc" },
        { code: "CLP", name: "Chile Peso" },
        { code: "CNY", name: "China Yuan Renminbi" },
        { code: "COP", name: "Colombia Peso" },
        { code: "CRC", name: "Costa Rica Colon" },
        { code: "CUC", name: "Cuba Convertible Peso" },
        { code: "CUP", name: "Cuba Peso" },
        { code: "CVE", name: "Cape Verde Escudo" },
        { code: "CZK", name: "Czech Republic Koruna" },
        { code: "DJF", name: "Djibouti Franc" },
        { code: "DKK", name: "Denmark Krone" },
        { code: "DOP", name: "Dominican Republic Peso" },
        { code: "DZD", name: "Algeria Dinar" },
        { code: "EGP", name: "Egypt Pound" },
        { code: "ERN", name: "Eritrea Nakfa" },
        { code: "ETB", name: "Ethiopia Birr" },
        { code: "EUR", name: "Euro Member Countries" },
        { code: "FJD", name: "Fiji Dollar" },
        { code: "FKP", name: "Falkland Islands (Malvinas) Pound" },
        { code: "GBP", name: "United Kingdom Pound" },
        { code: "GEL", name: "Georgia Lari" },
        { code: "GGP", name: "Guernsey Pound" },
        { code: "GHS", name: "Ghana Cedi" },
        { code: "GIP", name: "Gibraltar Pound" },
        { code: "GMD", name: "Gambia Dalasi" },
        { code: "GNF", name: "Guinea Franc" },
        { code: "GTQ", name: "Guatemala Quetzal" },
        { code: "GYD", name: "Guyana Dollar" },
        { code: "HKD", name: "Hong Kong Dollar" },
        { code: "HNL", name: "Honduras Lempira" },
        { code: "HRK", name: "Croatia Kuna" },
        { code: "HTG", name: "Haiti Gourde" },
        { code: "HUF", name: "Hungary Forint" },
        { code: "IDR", name: "Indonesia Rupiah" },
        { code: "ILS", name: "Israel Shekel" },
        { code: "IMP", name: "Isle of Man Pound" },
        { code: "INR", name: "India Rupee" },
        { code: "IQD", name: "Iraq Dinar" },
        { code: "IRR", name: "Iran Rial" },
        { code: "ISK", name: "Iceland Krona" },
        { code: "JEP", name: "Jersey Pound" },
        { code: "JMD", name: "Jamaica Dollar" },
        { code: "JOD", name: "Jordan Dinar" },
        { code: "JPY", name: "Japan Yen" },
        { code: "KES", name: "Kenya Shilling" },
        { code: "KGS", name: "Kyrgyzstan Som" },
        { code: "KHR", name: "Cambodia Riel" },
        { code: "KMF", name: "Comoros Franc" },
        { code: "KPW", name: "Korea (North) Won" },
        { code: "KRW", name: "Korea (South) Won" },
        { code: "KWD", name: "Kuwait Dinar" },
        { code: "KYD", name: "Cayman Islands Dollar" },
        { code: "KZT", name: "Kazakhstan Tenge" },
        { code: "LAK", name: "Laos Kip" },
        { code: "LBP", name: "Lebanon Pound" },
        { code: "LKR", name: "Sri Lanka Rupee" },
        { code: "LRD", name: "Liberia Dollar" },
        { code: "LSL", name: "Lesotho Loti" },
        { code: "LTL", name: "Lithuania Litas" },
        { code: "LYD", name: "Libya Dinar" },
        { code: "MAD", name: "Morocco Dirham" },
        { code: "MDL", name: "Moldova Leu" },
        { code: "MGA", name: "Madagascar Ariary" },
        { code: "MKD", name: "Macedonia Denar" },
        { code: "MMK", name: "Myanmar (Burma) Kyat" },
        { code: "MNT", name: "Mongolia Tughrik" },
        { code: "MOP", name: "Macau Pataca" },
        { code: "MRO", name: "Mauritania Ouguiya" },
        { code: "MUR", name: "Mauritius Rupee" },
        { code: "MVR", name: "Maldives (Maldive Islands) Rufiyaa" },
        { code: "MWK", name: "Malawi Kwacha" },
        { code: "MXN", name: "Mexico Peso" },
        { code: "MYR", name: "Malaysia Ringgit" },
        { code: "MZN", name: "Mozambique Metical" },
        { code: "NAD", name: "Namibia Dollar" },
        { code: "NGN", name: "Nigeria Naira" },
        { code: "NIO", name: "Nicaragua Cordoba" },
        { code: "NOK", name: "Norway Krone" },
        { code: "NPR", name: "Nepal Rupee" },
        { code: "NZD", name: "New Zealand Dollar" },
        { code: "OMR", name: "Oman Rial" },
        { code: "PAB", name: "Panama Balboa" },
        { code: "PEN", name: "Peru Nuevo Sol" },
        { code: "PGK", name: "Papua New Guinea Kina" },
        { code: "PHP", name: "Philippines Peso" },
        { code: "PKR", name: "Pakistan Rupee" },
        { code: "PLN", name: "Poland Zloty" },
        { code: "PYG", name: "Paraguay Guarani" },
        { code: "QAR", name: "Qatar Riyal" },
        { code: "RON", name: "Romania New Leu" },
        { code: "RSD", name: "Serbia Dinar" },
        { code: "RUB", name: "Russia Ruble" },
        { code: "RWF", name: "Rwanda Franc" },
        { code: "SAR", name: "Saudi Arabia Riyal" },
        { code: "SBD", name: "Solomon Islands Dollar" },
        { code: "SCR", name: "Seychelles Rupee" },
        { code: "SDG", name: "Sudan Pound" },
        { code: "SEK", name: "Sweden Krona" },
        { code: "SGD", name: "Singapore Dollar" },
        { code: "SHP", name: "Saint Helena Pound" },
        { code: "SLL", name: "Sierra Leone Leone" },
        { code: "SOS", name: "Somalia Shilling" },
        { code: "SPL", name: "Seborga Luigino" },
        { code: "SRD", name: "Suriname Dollar" },
        { code: "STD", name: "São Tomé and Príncipe Dobra" },
        { code: "SVC", name: "El Salvador Colon" },
        { code: "SYP", name: "Syria Pound" },
        { code: "SZL", name: "Swaziland Lilangeni" },
        { code: "THB", name: "Thailand Baht" },
        { code: "TJS", name: "Tajikistan Somoni" },
        { code: "TMT", name: "Turkmenistan Manat" },
        { code: "TND", name: "Tunisia Dinar" },
        { code: "TOP", name: "Tonga Pa'anga" },
        { code: "TRY", name: "Turkey Lira" },
        { code: "TTD", name: "Trinidad and Tobago Dollar" },
        { code: "TVD", name: "Tuvalu Dollar" },
        { code: "TWD", name: "Taiwan New Dollar" },
        { code: "TZS", name: "Tanzania Shilling" },
        { code: "UAH", name: "Ukraine Hryvnia" },
        { code: "UGX", name: "Uganda Shilling" },
        { code: "USD", name: "United States Dollar" },
        { code: "UYU", name: "Uruguay Peso" },
        { code: "UZS", name: "Uzbekistan Som" },
        { code: "VEF", name: "Venezuela Bolivar" },
        { code: "VND", name: "Viet Nam Dong" },
        { code: "VUV", name: "Vanuatu Vatu" },
        { code: "WST", name: "Samoa Tala" },
        {
          code: "XAF",
          name: "Communauté Financière Africaine (BEAC) CFA Franc BEAC",
        },
        { code: "XCD", name: "East Caribbean Dollar" },
        {
          code: "XDR",
          name: "International Monetary Fund (IMF) Special Drawing Rights",
        },
        { code: "XOF", name: "Communauté Financière Africaine (BCEAO) Franc" },
        { code: "XPF", name: "Comptoirs Français du Pacifique (CFP) Franc" },
        { code: "YER", name: "Yemen Rial" },
        { code: "ZAR", name: "South Africa Rand" },
        { code: "ZMW", name: "Zambia Kwacha" },
        { code: "ZWD", name: "Zimbabwe Dollar" },
      ],
      colorNames: [
        "AliceBlue",
        "Black",
        "Navy",
        "DarkBlue",
        "MediumBlue",
        "Blue",
        "DarkGreen",
        "Green",
        "Teal",
        "DarkCyan",
        "DeepSkyBlue",
        "DarkTurquoise",
        "MediumSpringGreen",
        "Lime",
        "SpringGreen",
        "Aqua",
        "Cyan",
        "MidnightBlue",
        "DodgerBlue",
        "LightSeaGreen",
        "ForestGreen",
        "SeaGreen",
        "DarkSlateGray",
        "LimeGreen",
        "MediumSeaGreen",
        "Turquoise",
        "RoyalBlue",
        "SteelBlue",
        "DarkSlateBlue",
        "MediumTurquoise",
        "Indigo",
        "DarkOliveGreen",
        "CadetBlue",
        "CornflowerBlue",
        "RebeccaPurple",
        "MediumAquaMarine",
        "DimGray",
        "SlateBlue",
        "OliveDrab",
        "SlateGray",
        "LightSlateGray",
        "MediumSlateBlue",
        "LawnGreen",
        "Chartreuse",
        "Aquamarine",
        "Maroon",
        "Purple",
        "Olive",
        "Gray",
        "SkyBlue",
        "LightSkyBlue",
        "BlueViolet",
        "DarkRed",
        "DarkMagenta",
        "SaddleBrown",
        "Ivory",
        "White",
        "DarkSeaGreen",
        "LightGreen",
        "MediumPurple",
        "DarkViolet",
        "PaleGreen",
        "DarkOrchid",
        "YellowGreen",
        "Sienna",
        "Brown",
        "DarkGray",
        "LightBlue",
        "GreenYellow",
        "PaleTurquoise",
        "LightSteelBlue",
        "PowderBlue",
        "FireBrick",
        "DarkGoldenRod",
        "MediumOrchid",
        "RosyBrown",
        "DarkKhaki",
        "Silver",
        "MediumVioletRed",
        "IndianRed",
        "Peru",
        "Chocolate",
        "Tan",
        "LightGray",
        "Thistle",
        "Orchid",
        "GoldenRod",
        "PaleVioletRed",
        "Crimson",
        "Gainsboro",
        "Plum",
        "BurlyWood",
        "LightCyan",
        "Lavender",
        "DarkSalmon",
        "Violet",
        "PaleGoldenRod",
        "LightCoral",
        "Khaki",
        "AliceBlue",
        "HoneyDew",
        "Azure",
        "SandyBrown",
        "Wheat",
        "Beige",
        "WhiteSmoke",
        "MintCream",
        "GhostWhite",
        "Salmon",
        "AntiqueWhite",
        "Linen",
        "LightGoldenRodYellow",
        "OldLace",
        "Red",
        "Fuchsia",
        "Magenta",
        "DeepPink",
        "OrangeRed",
        "Tomato",
        "HotPink",
        "Coral",
        "DarkOrange",
        "LightSalmon",
        "Orange",
        "LightPink",
        "Pink",
        "Gold",
        "PeachPuff",
        "NavajoWhite",
        "Moccasin",
        "Bisque",
        "MistyRose",
        "BlanchedAlmond",
        "PapayaWhip",
        "LavenderBlush",
        "SeaShell",
        "Cornsilk",
        "LemonChiffon",
        "FloralWhite",
        "Snow",
        "Yellow",
        "LightYellow",
      ],
      fileExtension: {
        raster: [
          "bmp",
          "gif",
          "gpl",
          "ico",
          "jpeg",
          "psd",
          "png",
          "psp",
          "raw",
          "tiff",
        ],
        vector: [
          "3dv",
          "amf",
          "awg",
          "ai",
          "cgm",
          "cdr",
          "cmx",
          "dxf",
          "e2d",
          "egt",
          "eps",
          "fs",
          "odg",
          "svg",
          "xar",
        ],
        "3d": [
          "3dmf",
          "3dm",
          "3mf",
          "3ds",
          "an8",
          "aoi",
          "blend",
          "cal3d",
          "cob",
          "ctm",
          "iob",
          "jas",
          "max",
          "mb",
          "mdx",
          "obj",
          "x",
          "x3d",
        ],
        document: [
          "doc",
          "docx",
          "dot",
          "html",
          "xml",
          "odt",
          "odm",
          "ott",
          "csv",
          "rtf",
          "tex",
          "xhtml",
          "xps",
        ],
      },
      timezones: [
        {
          name: "Dateline Standard Time",
          abbr: "DST",
          offset: -12,
          isdst: !1,
          text: "(UTC-12:00) International Date Line West",
          utc: ["Etc/GMT+12"],
        },
        {
          name: "UTC-11",
          abbr: "U",
          offset: -11,
          isdst: !1,
          text: "(UTC-11:00) Coordinated Universal Time-11",
          utc: [
            "Etc/GMT+11",
            "Pacific/Midway",
            "Pacific/Niue",
            "Pacific/Pago_Pago",
          ],
        },
        {
          name: "Hawaiian Standard Time",
          abbr: "HST",
          offset: -10,
          isdst: !1,
          text: "(UTC-10:00) Hawaii",
          utc: [
            "Etc/GMT+10",
            "Pacific/Honolulu",
            "Pacific/Johnston",
            "Pacific/Rarotonga",
            "Pacific/Tahiti",
          ],
        },
        {
          name: "Alaskan Standard Time",
          abbr: "AKDT",
          offset: -8,
          isdst: !0,
          text: "(UTC-09:00) Alaska",
          utc: [
            "America/Anchorage",
            "America/Juneau",
            "America/Nome",
            "America/Sitka",
            "America/Yakutat",
          ],
        },
        {
          name: "Pacific Standard Time (Mexico)",
          abbr: "PDT",
          offset: -7,
          isdst: !0,
          text: "(UTC-08:00) Baja California",
          utc: ["America/Santa_Isabel"],
        },
        {
          name: "Pacific Standard Time",
          abbr: "PDT",
          offset: -7,
          isdst: !0,
          text: "(UTC-08:00) Pacific Time (US & Canada)",
          utc: [
            "America/Dawson",
            "America/Los_Angeles",
            "America/Tijuana",
            "America/Vancouver",
            "America/Whitehorse",
            "PST8PDT",
          ],
        },
        {
          name: "US Mountain Standard Time",
          abbr: "UMST",
          offset: -7,
          isdst: !1,
          text: "(UTC-07:00) Arizona",
          utc: [
            "America/Creston",
            "America/Dawson_Creek",
            "America/Hermosillo",
            "America/Phoenix",
            "Etc/GMT+7",
          ],
        },
        {
          name: "Mountain Standard Time (Mexico)",
          abbr: "MDT",
          offset: -6,
          isdst: !0,
          text: "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
          utc: ["America/Chihuahua", "America/Mazatlan"],
        },
        {
          name: "Mountain Standard Time",
          abbr: "MDT",
          offset: -6,
          isdst: !0,
          text: "(UTC-07:00) Mountain Time (US & Canada)",
          utc: [
            "America/Boise",
            "America/Cambridge_Bay",
            "America/Denver",
            "America/Edmonton",
            "America/Inuvik",
            "America/Ojinaga",
            "America/Yellowknife",
            "MST7MDT",
          ],
        },
        {
          name: "Central America Standard Time",
          abbr: "CAST",
          offset: -6,
          isdst: !1,
          text: "(UTC-06:00) Central America",
          utc: [
            "America/Belize",
            "America/Costa_Rica",
            "America/El_Salvador",
            "America/Guatemala",
            "America/Managua",
            "America/Tegucigalpa",
            "Etc/GMT+6",
            "Pacific/Galapagos",
          ],
        },
        {
          name: "Central Standard Time",
          abbr: "CDT",
          offset: -5,
          isdst: !0,
          text: "(UTC-06:00) Central Time (US & Canada)",
          utc: [
            "America/Chicago",
            "America/Indiana/Knox",
            "America/Indiana/Tell_City",
            "America/Matamoros",
            "America/Menominee",
            "America/North_Dakota/Beulah",
            "America/North_Dakota/Center",
            "America/North_Dakota/New_Salem",
            "America/Rainy_River",
            "America/Rankin_Inlet",
            "America/Resolute",
            "America/Winnipeg",
            "CST6CDT",
          ],
        },
        {
          name: "Central Standard Time (Mexico)",
          abbr: "CDT",
          offset: -5,
          isdst: !0,
          text: "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
          utc: [
            "America/Bahia_Banderas",
            "America/Cancun",
            "America/Merida",
            "America/Mexico_City",
            "America/Monterrey",
          ],
        },
        {
          name: "Canada Central Standard Time",
          abbr: "CCST",
          offset: -6,
          isdst: !1,
          text: "(UTC-06:00) Saskatchewan",
          utc: ["America/Regina", "America/Swift_Current"],
        },
        {
          name: "SA Pacific Standard Time",
          abbr: "SPST",
          offset: -5,
          isdst: !1,
          text: "(UTC-05:00) Bogota, Lima, Quito",
          utc: [
            "America/Bogota",
            "America/Cayman",
            "America/Coral_Harbour",
            "America/Eirunepe",
            "America/Guayaquil",
            "America/Jamaica",
            "America/Lima",
            "America/Panama",
            "America/Rio_Branco",
            "Etc/GMT+5",
          ],
        },
        {
          name: "Eastern Standard Time",
          abbr: "EDT",
          offset: -4,
          isdst: !0,
          text: "(UTC-05:00) Eastern Time (US & Canada)",
          utc: [
            "America/Detroit",
            "America/Havana",
            "America/Indiana/Petersburg",
            "America/Indiana/Vincennes",
            "America/Indiana/Winamac",
            "America/Iqaluit",
            "America/Kentucky/Monticello",
            "America/Louisville",
            "America/Montreal",
            "America/Nassau",
            "America/New_York",
            "America/Nipigon",
            "America/Pangnirtung",
            "America/Port-au-Prince",
            "America/Thunder_Bay",
            "America/Toronto",
            "EST5EDT",
          ],
        },
        {
          name: "US Eastern Standard Time",
          abbr: "UEDT",
          offset: -4,
          isdst: !0,
          text: "(UTC-05:00) Indiana (East)",
          utc: [
            "America/Indiana/Marengo",
            "America/Indiana/Vevay",
            "America/Indianapolis",
          ],
        },
        {
          name: "Venezuela Standard Time",
          abbr: "VST",
          offset: -4.5,
          isdst: !1,
          text: "(UTC-04:30) Caracas",
          utc: ["America/Caracas"],
        },
        {
          name: "Paraguay Standard Time",
          abbr: "PST",
          offset: -4,
          isdst: !1,
          text: "(UTC-04:00) Asuncion",
          utc: ["America/Asuncion"],
        },
        {
          name: "Atlantic Standard Time",
          abbr: "ADT",
          offset: -3,
          isdst: !0,
          text: "(UTC-04:00) Atlantic Time (Canada)",
          utc: [
            "America/Glace_Bay",
            "America/Goose_Bay",
            "America/Halifax",
            "America/Moncton",
            "America/Thule",
            "Atlantic/Bermuda",
          ],
        },
        {
          name: "Central Brazilian Standard Time",
          abbr: "CBST",
          offset: -4,
          isdst: !1,
          text: "(UTC-04:00) Cuiaba",
          utc: ["America/Campo_Grande", "America/Cuiaba"],
        },
        {
          name: "SA Western Standard Time",
          abbr: "SWST",
          offset: -4,
          isdst: !1,
          text: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
          utc: [
            "America/Anguilla",
            "America/Antigua",
            "America/Aruba",
            "America/Barbados",
            "America/Blanc-Sablon",
            "America/Boa_Vista",
            "America/Curacao",
            "America/Dominica",
            "America/Grand_Turk",
            "America/Grenada",
            "America/Guadeloupe",
            "America/Guyana",
            "America/Kralendijk",
            "America/La_Paz",
            "America/Lower_Princes",
            "America/Manaus",
            "America/Marigot",
            "America/Martinique",
            "America/Montserrat",
            "America/Port_of_Spain",
            "America/Porto_Velho",
            "America/Puerto_Rico",
            "America/Santo_Domingo",
            "America/St_Barthelemy",
            "America/St_Kitts",
            "America/St_Lucia",
            "America/St_Thomas",
            "America/St_Vincent",
            "America/Tortola",
            "Etc/GMT+4",
          ],
        },
        {
          name: "Pacific SA Standard Time",
          abbr: "PSST",
          offset: -4,
          isdst: !1,
          text: "(UTC-04:00) Santiago",
          utc: ["America/Santiago", "Antarctica/Palmer"],
        },
        {
          name: "Newfoundland Standard Time",
          abbr: "NDT",
          offset: -2.5,
          isdst: !0,
          text: "(UTC-03:30) Newfoundland",
          utc: ["America/St_Johns"],
        },
        {
          name: "E. South America Standard Time",
          abbr: "ESAST",
          offset: -3,
          isdst: !1,
          text: "(UTC-03:00) Brasilia",
          utc: ["America/Sao_Paulo"],
        },
        {
          name: "Argentina Standard Time",
          abbr: "AST",
          offset: -3,
          isdst: !1,
          text: "(UTC-03:00) Buenos Aires",
          utc: [
            "America/Argentina/La_Rioja",
            "America/Argentina/Rio_Gallegos",
            "America/Argentina/Salta",
            "America/Argentina/San_Juan",
            "America/Argentina/San_Luis",
            "America/Argentina/Tucuman",
            "America/Argentina/Ushuaia",
            "America/Buenos_Aires",
            "America/Catamarca",
            "America/Cordoba",
            "America/Jujuy",
            "America/Mendoza",
          ],
        },
        {
          name: "SA Eastern Standard Time",
          abbr: "SEST",
          offset: -3,
          isdst: !1,
          text: "(UTC-03:00) Cayenne, Fortaleza",
          utc: [
            "America/Araguaina",
            "America/Belem",
            "America/Cayenne",
            "America/Fortaleza",
            "America/Maceio",
            "America/Paramaribo",
            "America/Recife",
            "America/Santarem",
            "Antarctica/Rothera",
            "Atlantic/Stanley",
            "Etc/GMT+3",
          ],
        },
        {
          name: "Greenland Standard Time",
          abbr: "GDT",
          offset: -2,
          isdst: !0,
          text: "(UTC-03:00) Greenland",
          utc: ["America/Godthab"],
        },
        {
          name: "Montevideo Standard Time",
          abbr: "MST",
          offset: -3,
          isdst: !1,
          text: "(UTC-03:00) Montevideo",
          utc: ["America/Montevideo"],
        },
        {
          name: "Bahia Standard Time",
          abbr: "BST",
          offset: -3,
          isdst: !1,
          text: "(UTC-03:00) Salvador",
          utc: ["America/Bahia"],
        },
        {
          name: "UTC-02",
          abbr: "U",
          offset: -2,
          isdst: !1,
          text: "(UTC-02:00) Coordinated Universal Time-02",
          utc: ["America/Noronha", "Atlantic/South_Georgia", "Etc/GMT+2"],
        },
        {
          name: "Mid-Atlantic Standard Time",
          abbr: "MDT",
          offset: -1,
          isdst: !0,
          text: "(UTC-02:00) Mid-Atlantic - Old",
        },
        {
          name: "Azores Standard Time",
          abbr: "ADT",
          offset: 0,
          isdst: !0,
          text: "(UTC-01:00) Azores",
          utc: ["America/Scoresbysund", "Atlantic/Azores"],
        },
        {
          name: "Cape Verde Standard Time",
          abbr: "CVST",
          offset: -1,
          isdst: !1,
          text: "(UTC-01:00) Cape Verde Is.",
          utc: ["Atlantic/Cape_Verde", "Etc/GMT+1"],
        },
        {
          name: "Morocco Standard Time",
          abbr: "MDT",
          offset: 1,
          isdst: !0,
          text: "(UTC) Casablanca",
          utc: ["Africa/Casablanca", "Africa/El_Aaiun"],
        },
        {
          name: "UTC",
          abbr: "CUT",
          offset: 0,
          isdst: !1,
          text: "(UTC) Coordinated Universal Time",
          utc: ["America/Danmarkshavn", "Etc/GMT"],
        },
        {
          name: "GMT Standard Time",
          abbr: "GDT",
          offset: 1,
          isdst: !0,
          text: "(UTC) Dublin, Edinburgh, Lisbon, London",
          utc: [
            "Atlantic/Canary",
            "Atlantic/Faeroe",
            "Atlantic/Madeira",
            "Europe/Dublin",
            "Europe/Guernsey",
            "Europe/Isle_of_Man",
            "Europe/Jersey",
            "Europe/Lisbon",
            "Europe/London",
          ],
        },
        {
          name: "Greenwich Standard Time",
          abbr: "GST",
          offset: 0,
          isdst: !1,
          text: "(UTC) Monrovia, Reykjavik",
          utc: [
            "Africa/Abidjan",
            "Africa/Accra",
            "Africa/Bamako",
            "Africa/Banjul",
            "Africa/Bissau",
            "Africa/Conakry",
            "Africa/Dakar",
            "Africa/Freetown",
            "Africa/Lome",
            "Africa/Monrovia",
            "Africa/Nouakchott",
            "Africa/Ouagadougou",
            "Africa/Sao_Tome",
            "Atlantic/Reykjavik",
            "Atlantic/St_Helena",
          ],
        },
        {
          name: "W. Europe Standard Time",
          abbr: "WEDT",
          offset: 2,
          isdst: !0,
          text: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
          utc: [
            "Arctic/Longyearbyen",
            "Europe/Amsterdam",
            "Europe/Andorra",
            "Europe/Berlin",
            "Europe/Busingen",
            "Europe/Gibraltar",
            "Europe/Luxembourg",
            "Europe/Malta",
            "Europe/Monaco",
            "Europe/Oslo",
            "Europe/Rome",
            "Europe/San_Marino",
            "Europe/Stockholm",
            "Europe/Vaduz",
            "Europe/Vatican",
            "Europe/Vienna",
            "Europe/Zurich",
          ],
        },
        {
          name: "Central Europe Standard Time",
          abbr: "CEDT",
          offset: 2,
          isdst: !0,
          text: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
          utc: [
            "Europe/Belgrade",
            "Europe/Bratislava",
            "Europe/Budapest",
            "Europe/Ljubljana",
            "Europe/Podgorica",
            "Europe/Prague",
            "Europe/Tirane",
          ],
        },
        {
          name: "Romance Standard Time",
          abbr: "RDT",
          offset: 2,
          isdst: !0,
          text: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
          utc: [
            "Africa/Ceuta",
            "Europe/Brussels",
            "Europe/Copenhagen",
            "Europe/Madrid",
            "Europe/Paris",
          ],
        },
        {
          name: "Central European Standard Time",
          abbr: "CEDT",
          offset: 2,
          isdst: !0,
          text: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
          utc: [
            "Europe/Sarajevo",
            "Europe/Skopje",
            "Europe/Warsaw",
            "Europe/Zagreb",
          ],
        },
        {
          name: "W. Central Africa Standard Time",
          abbr: "WCAST",
          offset: 1,
          isdst: !1,
          text: "(UTC+01:00) West Central Africa",
          utc: [
            "Africa/Algiers",
            "Africa/Bangui",
            "Africa/Brazzaville",
            "Africa/Douala",
            "Africa/Kinshasa",
            "Africa/Lagos",
            "Africa/Libreville",
            "Africa/Luanda",
            "Africa/Malabo",
            "Africa/Ndjamena",
            "Africa/Niamey",
            "Africa/Porto-Novo",
            "Africa/Tunis",
            "Etc/GMT-1",
          ],
        },
        {
          name: "Namibia Standard Time",
          abbr: "NST",
          offset: 1,
          isdst: !1,
          text: "(UTC+01:00) Windhoek",
          utc: ["Africa/Windhoek"],
        },
        {
          name: "GTB Standard Time",
          abbr: "GDT",
          offset: 3,
          isdst: !0,
          text: "(UTC+02:00) Athens, Bucharest",
          utc: [
            "Asia/Nicosia",
            "Europe/Athens",
            "Europe/Bucharest",
            "Europe/Chisinau",
          ],
        },
        {
          name: "Middle East Standard Time",
          abbr: "MEDT",
          offset: 3,
          isdst: !0,
          text: "(UTC+02:00) Beirut",
          utc: ["Asia/Beirut"],
        },
        {
          name: "Egypt Standard Time",
          abbr: "EST",
          offset: 2,
          isdst: !1,
          text: "(UTC+02:00) Cairo",
          utc: ["Africa/Cairo"],
        },
        {
          name: "Syria Standard Time",
          abbr: "SDT",
          offset: 3,
          isdst: !0,
          text: "(UTC+02:00) Damascus",
          utc: ["Asia/Damascus"],
        },
        {
          name: "E. Europe Standard Time",
          abbr: "EEDT",
          offset: 3,
          isdst: !0,
          text: "(UTC+02:00) E. Europe",
        },
        {
          name: "South Africa Standard Time",
          abbr: "SAST",
          offset: 2,
          isdst: !1,
          text: "(UTC+02:00) Harare, Pretoria",
          utc: [
            "Africa/Blantyre",
            "Africa/Bujumbura",
            "Africa/Gaborone",
            "Africa/Harare",
            "Africa/Johannesburg",
            "Africa/Kigali",
            "Africa/Lubumbashi",
            "Africa/Lusaka",
            "Africa/Maputo",
            "Africa/Maseru",
            "Africa/Mbabane",
            "Etc/GMT-2",
          ],
        },
        {
          name: "FLE Standard Time",
          abbr: "FDT",
          offset: 3,
          isdst: !0,
          text: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
          utc: [
            "Europe/Helsinki",
            "Europe/Kiev",
            "Europe/Mariehamn",
            "Europe/Riga",
            "Europe/Sofia",
            "Europe/Tallinn",
            "Europe/Uzhgorod",
            "Europe/Vilnius",
            "Europe/Zaporozhye",
          ],
        },
        {
          name: "Turkey Standard Time",
          abbr: "TDT",
          offset: 3,
          isdst: !0,
          text: "(UTC+02:00) Istanbul",
          utc: ["Europe/Istanbul"],
        },
        {
          name: "Israel Standard Time",
          abbr: "JDT",
          offset: 3,
          isdst: !0,
          text: "(UTC+02:00) Jerusalem",
          utc: ["Asia/Jerusalem"],
        },
        {
          name: "Libya Standard Time",
          abbr: "LST",
          offset: 2,
          isdst: !1,
          text: "(UTC+02:00) Tripoli",
          utc: ["Africa/Tripoli"],
        },
        {
          name: "Jordan Standard Time",
          abbr: "JST",
          offset: 3,
          isdst: !1,
          text: "(UTC+03:00) Amman",
          utc: ["Asia/Amman"],
        },
        {
          name: "Arabic Standard Time",
          abbr: "AST",
          offset: 3,
          isdst: !1,
          text: "(UTC+03:00) Baghdad",
          utc: ["Asia/Baghdad"],
        },
        {
          name: "Kaliningrad Standard Time",
          abbr: "KST",
          offset: 3,
          isdst: !1,
          text: "(UTC+03:00) Kaliningrad, Minsk",
          utc: ["Europe/Kaliningrad", "Europe/Minsk"],
        },
        {
          name: "Arab Standard Time",
          abbr: "AST",
          offset: 3,
          isdst: !1,
          text: "(UTC+03:00) Kuwait, Riyadh",
          utc: [
            "Asia/Aden",
            "Asia/Bahrain",
            "Asia/Kuwait",
            "Asia/Qatar",
            "Asia/Riyadh",
          ],
        },
        {
          name: "E. Africa Standard Time",
          abbr: "EAST",
          offset: 3,
          isdst: !1,
          text: "(UTC+03:00) Nairobi",
          utc: [
            "Africa/Addis_Ababa",
            "Africa/Asmera",
            "Africa/Dar_es_Salaam",
            "Africa/Djibouti",
            "Africa/Juba",
            "Africa/Kampala",
            "Africa/Khartoum",
            "Africa/Mogadishu",
            "Africa/Nairobi",
            "Antarctica/Syowa",
            "Etc/GMT-3",
            "Indian/Antananarivo",
            "Indian/Comoro",
            "Indian/Mayotte",
          ],
        },
        {
          name: "Iran Standard Time",
          abbr: "IDT",
          offset: 4.5,
          isdst: !0,
          text: "(UTC+03:30) Tehran",
          utc: ["Asia/Tehran"],
        },
        {
          name: "Arabian Standard Time",
          abbr: "AST",
          offset: 4,
          isdst: !1,
          text: "(UTC+04:00) Abu Dhabi, Muscat",
          utc: ["Asia/Dubai", "Asia/Muscat", "Etc/GMT-4"],
        },
        {
          name: "Azerbaijan Standard Time",
          abbr: "ADT",
          offset: 5,
          isdst: !0,
          text: "(UTC+04:00) Baku",
          utc: ["Asia/Baku"],
        },
        {
          name: "Russian Standard Time",
          abbr: "RST",
          offset: 4,
          isdst: !1,
          text: "(UTC+04:00) Moscow, St. Petersburg, Volgograd",
          utc: [
            "Europe/Moscow",
            "Europe/Samara",
            "Europe/Simferopol",
            "Europe/Volgograd",
          ],
        },
        {
          name: "Mauritius Standard Time",
          abbr: "MST",
          offset: 4,
          isdst: !1,
          text: "(UTC+04:00) Port Louis",
          utc: ["Indian/Mahe", "Indian/Mauritius", "Indian/Reunion"],
        },
        {
          name: "Georgian Standard Time",
          abbr: "GST",
          offset: 4,
          isdst: !1,
          text: "(UTC+04:00) Tbilisi",
          utc: ["Asia/Tbilisi"],
        },
        {
          name: "Caucasus Standard Time",
          abbr: "CST",
          offset: 4,
          isdst: !1,
          text: "(UTC+04:00) Yerevan",
          utc: ["Asia/Yerevan"],
        },
        {
          name: "Afghanistan Standard Time",
          abbr: "AST",
          offset: 4.5,
          isdst: !1,
          text: "(UTC+04:30) Kabul",
          utc: ["Asia/Kabul"],
        },
        {
          name: "West Asia Standard Time",
          abbr: "WAST",
          offset: 5,
          isdst: !1,
          text: "(UTC+05:00) Ashgabat, Tashkent",
          utc: [
            "Antarctica/Mawson",
            "Asia/Aqtau",
            "Asia/Aqtobe",
            "Asia/Ashgabat",
            "Asia/Dushanbe",
            "Asia/Oral",
            "Asia/Samarkand",
            "Asia/Tashkent",
            "Etc/GMT-5",
            "Indian/Kerguelen",
            "Indian/Maldives",
          ],
        },
        {
          name: "Pakistan Standard Time",
          abbr: "PST",
          offset: 5,
          isdst: !1,
          text: "(UTC+05:00) Islamabad, Karachi",
          utc: ["Asia/Karachi"],
        },
        {
          name: "India Standard Time",
          abbr: "IST",
          offset: 5.5,
          isdst: !1,
          text: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
          utc: ["Asia/Calcutta"],
        },
        {
          name: "Sri Lanka Standard Time",
          abbr: "SLST",
          offset: 5.5,
          isdst: !1,
          text: "(UTC+05:30) Sri Jayawardenepura",
          utc: ["Asia/Colombo"],
        },
        {
          name: "Nepal Standard Time",
          abbr: "NST",
          offset: 5.75,
          isdst: !1,
          text: "(UTC+05:45) Kathmandu",
          utc: ["Asia/Katmandu"],
        },
        {
          name: "Central Asia Standard Time",
          abbr: "CAST",
          offset: 6,
          isdst: !1,
          text: "(UTC+06:00) Astana",
          utc: [
            "Antarctica/Vostok",
            "Asia/Almaty",
            "Asia/Bishkek",
            "Asia/Qyzylorda",
            "Asia/Urumqi",
            "Etc/GMT-6",
            "Indian/Chagos",
          ],
        },
        {
          name: "Bangladesh Standard Time",
          abbr: "BST",
          offset: 6,
          isdst: !1,
          text: "(UTC+06:00) Dhaka",
          utc: ["Asia/Dhaka", "Asia/Thimphu"],
        },
        {
          name: "Ekaterinburg Standard Time",
          abbr: "EST",
          offset: 6,
          isdst: !1,
          text: "(UTC+06:00) Ekaterinburg",
          utc: ["Asia/Yekaterinburg"],
        },
        {
          name: "Myanmar Standard Time",
          abbr: "MST",
          offset: 6.5,
          isdst: !1,
          text: "(UTC+06:30) Yangon (Rangoon)",
          utc: ["Asia/Rangoon", "Indian/Cocos"],
        },
        {
          name: "SE Asia Standard Time",
          abbr: "SAST",
          offset: 7,
          isdst: !1,
          text: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
          utc: [
            "Antarctica/Davis",
            "Asia/Bangkok",
            "Asia/Hovd",
            "Asia/Jakarta",
            "Asia/Phnom_Penh",
            "Asia/Pontianak",
            "Asia/Saigon",
            "Asia/Vientiane",
            "Etc/GMT-7",
            "Indian/Christmas",
          ],
        },
        {
          name: "N. Central Asia Standard Time",
          abbr: "NCAST",
          offset: 7,
          isdst: !1,
          text: "(UTC+07:00) Novosibirsk",
          utc: ["Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Omsk"],
        },
        {
          name: "China Standard Time",
          abbr: "CST",
          offset: 8,
          isdst: !1,
          text: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
          utc: ["Asia/Hong_Kong", "Asia/Macau", "Asia/Shanghai"],
        },
        {
          name: "North Asia Standard Time",
          abbr: "NAST",
          offset: 8,
          isdst: !1,
          text: "(UTC+08:00) Krasnoyarsk",
          utc: ["Asia/Krasnoyarsk"],
        },
        {
          name: "Singapore Standard Time",
          abbr: "MPST",
          offset: 8,
          isdst: !1,
          text: "(UTC+08:00) Kuala Lumpur, Singapore",
          utc: [
            "Asia/Brunei",
            "Asia/Kuala_Lumpur",
            "Asia/Kuching",
            "Asia/Makassar",
            "Asia/Manila",
            "Asia/Singapore",
            "Etc/GMT-8",
          ],
        },
        {
          name: "W. Australia Standard Time",
          abbr: "WAST",
          offset: 8,
          isdst: !1,
          text: "(UTC+08:00) Perth",
          utc: ["Antarctica/Casey", "Australia/Perth"],
        },
        {
          name: "Taipei Standard Time",
          abbr: "TST",
          offset: 8,
          isdst: !1,
          text: "(UTC+08:00) Taipei",
          utc: ["Asia/Taipei"],
        },
        {
          name: "Ulaanbaatar Standard Time",
          abbr: "UST",
          offset: 8,
          isdst: !1,
          text: "(UTC+08:00) Ulaanbaatar",
          utc: ["Asia/Choibalsan", "Asia/Ulaanbaatar"],
        },
        {
          name: "North Asia East Standard Time",
          abbr: "NAEST",
          offset: 9,
          isdst: !1,
          text: "(UTC+09:00) Irkutsk",
          utc: ["Asia/Irkutsk"],
        },
        {
          name: "Tokyo Standard Time",
          abbr: "TST",
          offset: 9,
          isdst: !1,
          text: "(UTC+09:00) Osaka, Sapporo, Tokyo",
          utc: [
            "Asia/Dili",
            "Asia/Jayapura",
            "Asia/Tokyo",
            "Etc/GMT-9",
            "Pacific/Palau",
          ],
        },
        {
          name: "Korea Standard Time",
          abbr: "KST",
          offset: 9,
          isdst: !1,
          text: "(UTC+09:00) Seoul",
          utc: ["Asia/Pyongyang", "Asia/Seoul"],
        },
        {
          name: "Cen. Australia Standard Time",
          abbr: "CAST",
          offset: 9.5,
          isdst: !1,
          text: "(UTC+09:30) Adelaide",
          utc: ["Australia/Adelaide", "Australia/Broken_Hill"],
        },
        {
          name: "AUS Central Standard Time",
          abbr: "ACST",
          offset: 9.5,
          isdst: !1,
          text: "(UTC+09:30) Darwin",
          utc: ["Australia/Darwin"],
        },
        {
          name: "E. Australia Standard Time",
          abbr: "EAST",
          offset: 10,
          isdst: !1,
          text: "(UTC+10:00) Brisbane",
          utc: ["Australia/Brisbane", "Australia/Lindeman"],
        },
        {
          name: "AUS Eastern Standard Time",
          abbr: "AEST",
          offset: 10,
          isdst: !1,
          text: "(UTC+10:00) Canberra, Melbourne, Sydney",
          utc: ["Australia/Melbourne", "Australia/Sydney"],
        },
        {
          name: "West Pacific Standard Time",
          abbr: "WPST",
          offset: 10,
          isdst: !1,
          text: "(UTC+10:00) Guam, Port Moresby",
          utc: [
            "Antarctica/DumontDUrville",
            "Etc/GMT-10",
            "Pacific/Guam",
            "Pacific/Port_Moresby",
            "Pacific/Saipan",
            "Pacific/Truk",
          ],
        },
        {
          name: "Tasmania Standard Time",
          abbr: "TST",
          offset: 10,
          isdst: !1,
          text: "(UTC+10:00) Hobart",
          utc: ["Australia/Currie", "Australia/Hobart"],
        },
        {
          name: "Yakutsk Standard Time",
          abbr: "YST",
          offset: 10,
          isdst: !1,
          text: "(UTC+10:00) Yakutsk",
          utc: ["Asia/Chita", "Asia/Khandyga", "Asia/Yakutsk"],
        },
        {
          name: "Central Pacific Standard Time",
          abbr: "CPST",
          offset: 11,
          isdst: !1,
          text: "(UTC+11:00) Solomon Is., New Caledonia",
          utc: [
            "Antarctica/Macquarie",
            "Etc/GMT-11",
            "Pacific/Efate",
            "Pacific/Guadalcanal",
            "Pacific/Kosrae",
            "Pacific/Noumea",
            "Pacific/Ponape",
          ],
        },
        {
          name: "Vladivostok Standard Time",
          abbr: "VST",
          offset: 11,
          isdst: !1,
          text: "(UTC+11:00) Vladivostok",
          utc: ["Asia/Sakhalin", "Asia/Ust-Nera", "Asia/Vladivostok"],
        },
        {
          name: "New Zealand Standard Time",
          abbr: "NZST",
          offset: 12,
          isdst: !1,
          text: "(UTC+12:00) Auckland, Wellington",
          utc: ["Antarctica/McMurdo", "Pacific/Auckland"],
        },
        {
          name: "UTC+12",
          abbr: "U",
          offset: 12,
          isdst: !1,
          text: "(UTC+12:00) Coordinated Universal Time+12",
          utc: [
            "Etc/GMT-12",
            "Pacific/Funafuti",
            "Pacific/Kwajalein",
            "Pacific/Majuro",
            "Pacific/Nauru",
            "Pacific/Tarawa",
            "Pacific/Wake",
            "Pacific/Wallis",
          ],
        },
        {
          name: "Fiji Standard Time",
          abbr: "FST",
          offset: 12,
          isdst: !1,
          text: "(UTC+12:00) Fiji",
          utc: ["Pacific/Fiji"],
        },
        {
          name: "Magadan Standard Time",
          abbr: "MST",
          offset: 12,
          isdst: !1,
          text: "(UTC+12:00) Magadan",
          utc: [
            "Asia/Anadyr",
            "Asia/Kamchatka",
            "Asia/Magadan",
            "Asia/Srednekolymsk",
          ],
        },
        {
          name: "Kamchatka Standard Time",
          abbr: "KDT",
          offset: 13,
          isdst: !0,
          text: "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
        },
        {
          name: "Tonga Standard Time",
          abbr: "TST",
          offset: 13,
          isdst: !1,
          text: "(UTC+13:00) Nuku'alofa",
          utc: [
            "Etc/GMT-13",
            "Pacific/Enderbury",
            "Pacific/Fakaofo",
            "Pacific/Tongatapu",
          ],
        },
        {
          name: "Samoa Standard Time",
          abbr: "SST",
          offset: 13,
          isdst: !1,
          text: "(UTC+13:00) Samoa",
          utc: ["Pacific/Apia"],
        },
      ],
    },
    q = Object.prototype.hasOwnProperty,
    r =
      Object.keys ||
      function (a) {
        var b = [];
        for (var c in a) q.call(a, c) && b.push(c);
        return b;
      };
  (a.prototype.get = function (a) {
    return g(p[a]);
  }),
    (a.prototype.mac_address = function (a) {
      (a = b(a)), a.separator || (a.separator = a.networkVersion ? "." : ":");
      var c = "ABCDEF1234567890",
        d = "";
      return (d = a.networkVersion
        ? this.n(this.string, 3, { pool: c, length: 4 }).join(a.separator)
        : this.n(this.string, 6, { pool: c, length: 2 }).join(a.separator));
    }),
    (a.prototype.normal = function (a) {
      if (
        ((a = b(a, { mean: 0, dev: 1, pool: [] })),
        c(
          a.pool.constructor !== Array,
          "Chance: The pool option must be a valid array."
        ),
        a.pool.length > 0)
      )
        return this.normal_pool(a);
      var d,
        e,
        f,
        g,
        h = a.mean,
        i = a.dev;
      do
        (e = 2 * this.random() - 1),
          (f = 2 * this.random() - 1),
          (d = e * e + f * f);
      while (d >= 1);
      return (g = e * Math.sqrt((-2 * Math.log(d)) / d)), i * g + h;
    }),
    (a.prototype.normal_pool = function (a) {
      var b = 0;
      do {
        var c = Math.round(this.normal({ mean: a.mean, dev: a.dev }));
        if (c < a.pool.length && c >= 0) return a.pool[c];
        b++;
      } while (100 > b);
      throw new RangeError(
        "Chance: Your pool is too small for the given mean and standard deviation. Please adjust."
      );
    }),
    (a.prototype.radio = function (a) {
      a = b(a, { side: "?" });
      var c = "";
      switch (a.side.toLowerCase()) {
        case "east":
        case "e":
          c = "W";
          break;
        case "west":
        case "w":
          c = "K";
          break;
        default:
          c = this.character({ pool: "KW" });
      }
      return (
        c +
        this.character({ alpha: !0, casing: "upper" }) +
        this.character({ alpha: !0, casing: "upper" }) +
        this.character({ alpha: !0, casing: "upper" })
      );
    }),
    (a.prototype.set = function (a, b) {
      "string" == typeof a ? (p[a] = b) : (p = g(a, p));
    }),
    (a.prototype.tv = function (a) {
      return this.radio(a);
    }),
    (a.prototype.cnpj = function () {
      var a = this.n(this.natural, 8, { max: 9 }),
        b =
          2 +
          6 * a[7] +
          7 * a[6] +
          8 * a[5] +
          9 * a[4] +
          2 * a[3] +
          3 * a[2] +
          4 * a[1] +
          5 * a[0];
      (b = 11 - (b % 11)), b >= 10 && (b = 0);
      var c =
        2 * b +
        3 +
        7 * a[7] +
        8 * a[6] +
        9 * a[5] +
        2 * a[4] +
        3 * a[3] +
        4 * a[2] +
        5 * a[1] +
        6 * a[0];
      return (
        (c = 11 - (c % 11)),
        c >= 10 && (c = 0),
        "" +
          a[0] +
          a[1] +
          "." +
          a[2] +
          a[3] +
          a[4] +
          "." +
          a[5] +
          a[6] +
          a[7] +
          "/0001-" +
          b +
          c
      );
    }),
    (a.prototype.mersenne_twister = function (a) {
      return new s(a);
    }),
    (a.prototype.blueimp_md5 = function () {
      return new t();
    });
  var s = function (a) {
    void 0 === a && (a = Math.floor(Math.random() * Math.pow(10, 13))),
      (this.N = 624),
      (this.M = 397),
      (this.MATRIX_A = 2567483615),
      (this.UPPER_MASK = 2147483648),
      (this.LOWER_MASK = 2147483647),
      (this.mt = new Array(this.N)),
      (this.mti = this.N + 1),
      this.init_genrand(a);
  };
  (s.prototype.init_genrand = function (a) {
    for (this.mt[0] = a >>> 0, this.mti = 1; this.mti < this.N; this.mti++)
      (a = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)),
        (this.mt[this.mti] =
          ((1812433253 * ((4294901760 & a) >>> 16)) << 16) +
          1812433253 * (65535 & a) +
          this.mti),
        (this.mt[this.mti] >>>= 0);
  }),
    (s.prototype.init_by_array = function (a, b) {
      var c,
        d,
        e = 1,
        f = 0;
      for (this.init_genrand(19650218), c = this.N > b ? this.N : b; c; c--)
        (d = this.mt[e - 1] ^ (this.mt[e - 1] >>> 30)),
          (this.mt[e] =
            (this.mt[e] ^
              (((1664525 * ((4294901760 & d) >>> 16)) << 16) +
                1664525 * (65535 & d))) +
            a[f] +
            f),
          (this.mt[e] >>>= 0),
          e++,
          f++,
          e >= this.N && ((this.mt[0] = this.mt[this.N - 1]), (e = 1)),
          f >= b && (f = 0);
      for (c = this.N - 1; c; c--)
        (d = this.mt[e - 1] ^ (this.mt[e - 1] >>> 30)),
          (this.mt[e] =
            (this.mt[e] ^
              (((1566083941 * ((4294901760 & d) >>> 16)) << 16) +
                1566083941 * (65535 & d))) -
            e),
          (this.mt[e] >>>= 0),
          e++,
          e >= this.N && ((this.mt[0] = this.mt[this.N - 1]), (e = 1));
      this.mt[0] = 2147483648;
    }),
    (s.prototype.genrand_int32 = function () {
      var a,
        b = new Array(0, this.MATRIX_A);
      if (this.mti >= this.N) {
        var c;
        for (
          this.mti === this.N + 1 && this.init_genrand(5489), c = 0;
          c < this.N - this.M;
          c++
        )
          (a =
            (this.mt[c] & this.UPPER_MASK) |
            (this.mt[c + 1] & this.LOWER_MASK)),
            (this.mt[c] = this.mt[c + this.M] ^ (a >>> 1) ^ b[1 & a]);
        for (; c < this.N - 1; c++)
          (a =
            (this.mt[c] & this.UPPER_MASK) |
            (this.mt[c + 1] & this.LOWER_MASK)),
            (this.mt[c] =
              this.mt[c + (this.M - this.N)] ^ (a >>> 1) ^ b[1 & a]);
        (a =
          (this.mt[this.N - 1] & this.UPPER_MASK) |
          (this.mt[0] & this.LOWER_MASK)),
          (this.mt[this.N - 1] = this.mt[this.M - 1] ^ (a >>> 1) ^ b[1 & a]),
          (this.mti = 0);
      }
      return (
        (a = this.mt[this.mti++]),
        (a ^= a >>> 11),
        (a ^= (a << 7) & 2636928640),
        (a ^= (a << 15) & 4022730752),
        (a ^= a >>> 18),
        a >>> 0
      );
    }),
    (s.prototype.genrand_int31 = function () {
      return this.genrand_int32() >>> 1;
    }),
    (s.prototype.genrand_real1 = function () {
      return this.genrand_int32() * (1 / 4294967295);
    }),
    (s.prototype.random = function () {
      return this.genrand_int32() * (1 / 4294967296);
    }),
    (s.prototype.genrand_real3 = function () {
      return (this.genrand_int32() + 0.5) * (1 / 4294967296);
    }),
    (s.prototype.genrand_res53 = function () {
      var a = this.genrand_int32() >>> 5,
        b = this.genrand_int32() >>> 6;
      return (67108864 * a + b) * (1 / 9007199254740992);
    });
  var t = function () {};
  (t.prototype.VERSION = "1.0.1"),
    (t.prototype.safe_add = function (a, b) {
      var c = (65535 & a) + (65535 & b),
        d = (a >> 16) + (b >> 16) + (c >> 16);
      return (d << 16) | (65535 & c);
    }),
    (t.prototype.bit_roll = function (a, b) {
      return (a << b) | (a >>> (32 - b));
    }),
    (t.prototype.md5_cmn = function (a, b, c, d, e, f) {
      return this.safe_add(
        this.bit_roll(
          this.safe_add(this.safe_add(b, a), this.safe_add(d, f)),
          e
        ),
        c
      );
    }),
    (t.prototype.md5_ff = function (a, b, c, d, e, f, g) {
      return this.md5_cmn((b & c) | (~b & d), a, b, e, f, g);
    }),
    (t.prototype.md5_gg = function (a, b, c, d, e, f, g) {
      return this.md5_cmn((b & d) | (c & ~d), a, b, e, f, g);
    }),
    (t.prototype.md5_hh = function (a, b, c, d, e, f, g) {
      return this.md5_cmn(b ^ c ^ d, a, b, e, f, g);
    }),
    (t.prototype.md5_ii = function (a, b, c, d, e, f, g) {
      return this.md5_cmn(c ^ (b | ~d), a, b, e, f, g);
    }),
    (t.prototype.binl_md5 = function (a, b) {
      (a[b >> 5] |= 128 << b % 32), (a[(((b + 64) >>> 9) << 4) + 14] = b);
      var c,
        d,
        e,
        f,
        g,
        h = 1732584193,
        i = -271733879,
        j = -1732584194,
        k = 271733878;
      for (c = 0; c < a.length; c += 16)
        (d = h),
          (e = i),
          (f = j),
          (g = k),
          (h = this.md5_ff(h, i, j, k, a[c], 7, -680876936)),
          (k = this.md5_ff(k, h, i, j, a[c + 1], 12, -389564586)),
          (j = this.md5_ff(j, k, h, i, a[c + 2], 17, 606105819)),
          (i = this.md5_ff(i, j, k, h, a[c + 3], 22, -1044525330)),
          (h = this.md5_ff(h, i, j, k, a[c + 4], 7, -176418897)),
          (k = this.md5_ff(k, h, i, j, a[c + 5], 12, 1200080426)),
          (j = this.md5_ff(j, k, h, i, a[c + 6], 17, -1473231341)),
          (i = this.md5_ff(i, j, k, h, a[c + 7], 22, -45705983)),
          (h = this.md5_ff(h, i, j, k, a[c + 8], 7, 1770035416)),
          (k = this.md5_ff(k, h, i, j, a[c + 9], 12, -1958414417)),
          (j = this.md5_ff(j, k, h, i, a[c + 10], 17, -42063)),
          (i = this.md5_ff(i, j, k, h, a[c + 11], 22, -1990404162)),
          (h = this.md5_ff(h, i, j, k, a[c + 12], 7, 1804603682)),
          (k = this.md5_ff(k, h, i, j, a[c + 13], 12, -40341101)),
          (j = this.md5_ff(j, k, h, i, a[c + 14], 17, -1502002290)),
          (i = this.md5_ff(i, j, k, h, a[c + 15], 22, 1236535329)),
          (h = this.md5_gg(h, i, j, k, a[c + 1], 5, -165796510)),
          (k = this.md5_gg(k, h, i, j, a[c + 6], 9, -1069501632)),
          (j = this.md5_gg(j, k, h, i, a[c + 11], 14, 643717713)),
          (i = this.md5_gg(i, j, k, h, a[c], 20, -373897302)),
          (h = this.md5_gg(h, i, j, k, a[c + 5], 5, -701558691)),
          (k = this.md5_gg(k, h, i, j, a[c + 10], 9, 38016083)),
          (j = this.md5_gg(j, k, h, i, a[c + 15], 14, -660478335)),
          (i = this.md5_gg(i, j, k, h, a[c + 4], 20, -405537848)),
          (h = this.md5_gg(h, i, j, k, a[c + 9], 5, 568446438)),
          (k = this.md5_gg(k, h, i, j, a[c + 14], 9, -1019803690)),
          (j = this.md5_gg(j, k, h, i, a[c + 3], 14, -187363961)),
          (i = this.md5_gg(i, j, k, h, a[c + 8], 20, 1163531501)),
          (h = this.md5_gg(h, i, j, k, a[c + 13], 5, -1444681467)),
          (k = this.md5_gg(k, h, i, j, a[c + 2], 9, -51403784)),
          (j = this.md5_gg(j, k, h, i, a[c + 7], 14, 1735328473)),
          (i = this.md5_gg(i, j, k, h, a[c + 12], 20, -1926607734)),
          (h = this.md5_hh(h, i, j, k, a[c + 5], 4, -378558)),
          (k = this.md5_hh(k, h, i, j, a[c + 8], 11, -2022574463)),
          (j = this.md5_hh(j, k, h, i, a[c + 11], 16, 1839030562)),
          (i = this.md5_hh(i, j, k, h, a[c + 14], 23, -35309556)),
          (h = this.md5_hh(h, i, j, k, a[c + 1], 4, -1530992060)),
          (k = this.md5_hh(k, h, i, j, a[c + 4], 11, 1272893353)),
          (j = this.md5_hh(j, k, h, i, a[c + 7], 16, -155497632)),
          (i = this.md5_hh(i, j, k, h, a[c + 10], 23, -1094730640)),
          (h = this.md5_hh(h, i, j, k, a[c + 13], 4, 681279174)),
          (k = this.md5_hh(k, h, i, j, a[c], 11, -358537222)),
          (j = this.md5_hh(j, k, h, i, a[c + 3], 16, -722521979)),
          (i = this.md5_hh(i, j, k, h, a[c + 6], 23, 76029189)),
          (h = this.md5_hh(h, i, j, k, a[c + 9], 4, -640364487)),
          (k = this.md5_hh(k, h, i, j, a[c + 12], 11, -421815835)),
          (j = this.md5_hh(j, k, h, i, a[c + 15], 16, 530742520)),
          (i = this.md5_hh(i, j, k, h, a[c + 2], 23, -995338651)),
          (h = this.md5_ii(h, i, j, k, a[c], 6, -198630844)),
          (k = this.md5_ii(k, h, i, j, a[c + 7], 10, 1126891415)),
          (j = this.md5_ii(j, k, h, i, a[c + 14], 15, -1416354905)),
          (i = this.md5_ii(i, j, k, h, a[c + 5], 21, -57434055)),
          (h = this.md5_ii(h, i, j, k, a[c + 12], 6, 1700485571)),
          (k = this.md5_ii(k, h, i, j, a[c + 3], 10, -1894986606)),
          (j = this.md5_ii(j, k, h, i, a[c + 10], 15, -1051523)),
          (i = this.md5_ii(i, j, k, h, a[c + 1], 21, -2054922799)),
          (h = this.md5_ii(h, i, j, k, a[c + 8], 6, 1873313359)),
          (k = this.md5_ii(k, h, i, j, a[c + 15], 10, -30611744)),
          (j = this.md5_ii(j, k, h, i, a[c + 6], 15, -1560198380)),
          (i = this.md5_ii(i, j, k, h, a[c + 13], 21, 1309151649)),
          (h = this.md5_ii(h, i, j, k, a[c + 4], 6, -145523070)),
          (k = this.md5_ii(k, h, i, j, a[c + 11], 10, -1120210379)),
          (j = this.md5_ii(j, k, h, i, a[c + 2], 15, 718787259)),
          (i = this.md5_ii(i, j, k, h, a[c + 9], 21, -343485551)),
          (h = this.safe_add(h, d)),
          (i = this.safe_add(i, e)),
          (j = this.safe_add(j, f)),
          (k = this.safe_add(k, g));
      return [h, i, j, k];
    }),
    (t.prototype.binl2rstr = function (a) {
      var b,
        c = "";
      for (b = 0; b < 32 * a.length; b += 8)
        c += String.fromCharCode((a[b >> 5] >>> b % 32) & 255);
      return c;
    }),
    (t.prototype.rstr2binl = function (a) {
      var b,
        c = [];
      for (c[(a.length >> 2) - 1] = void 0, b = 0; b < c.length; b += 1)
        c[b] = 0;
      for (b = 0; b < 8 * a.length; b += 8)
        c[b >> 5] |= (255 & a.charCodeAt(b / 8)) << b % 32;
      return c;
    }),
    (t.prototype.rstr_md5 = function (a) {
      return this.binl2rstr(this.binl_md5(this.rstr2binl(a), 8 * a.length));
    }),
    (t.prototype.rstr_hmac_md5 = function (a, b) {
      var c,
        d,
        e = this.rstr2binl(a),
        f = [],
        g = [];
      for (
        f[15] = g[15] = void 0,
          e.length > 16 && (e = this.binl_md5(e, 8 * a.length)),
          c = 0;
        16 > c;
        c += 1
      )
        (f[c] = 909522486 ^ e[c]), (g[c] = 1549556828 ^ e[c]);
      return (
        (d = this.binl_md5(f.concat(this.rstr2binl(b)), 512 + 8 * b.length)),
        this.binl2rstr(this.binl_md5(g.concat(d), 640))
      );
    }),
    (t.prototype.rstr2hex = function (a) {
      var b,
        c,
        d = "0123456789abcdef",
        e = "";
      for (c = 0; c < a.length; c += 1)
        (b = a.charCodeAt(c)),
          (e += d.charAt((b >>> 4) & 15) + d.charAt(15 & b));
      return e;
    }),
    (t.prototype.str2rstr_utf8 = function (a) {
      return unescape(encodeURIComponent(a));
    }),
    (t.prototype.raw_md5 = function (a) {
      return this.rstr_md5(this.str2rstr_utf8(a));
    }),
    (t.prototype.hex_md5 = function (a) {
      return this.rstr2hex(this.raw_md5(a));
    }),
    (t.prototype.raw_hmac_md5 = function (a, b) {
      return this.rstr_hmac_md5(this.str2rstr_utf8(a), this.str2rstr_utf8(b));
    }),
    (t.prototype.hex_hmac_md5 = function (a, b) {
      return this.rstr2hex(this.raw_hmac_md5(a, b));
    }),
    (t.prototype.md5 = function (a, b, c) {
      return b
        ? c
          ? this.raw_hmac_md5(b, a)
          : this.hex_hmac_md5(b, a)
        : c
        ? this.raw_md5(a)
        : this.hex_md5(a);
    }),
    "undefined" != typeof exports &&
      ("undefined" != typeof module &&
        module.exports &&
        (exports = module.exports = a),
      (exports.Chance = a)),
    "function" == typeof define &&
      define.amd &&
      define([], function () {
        return a;
      }),
    "undefined" != typeof importScripts && (chance = new a()),
    "object" == typeof window &&
      "object" == typeof window.document &&
      ((window.Chance = a), (window.chance = new a()));
})();
//# sourceMappingURL=chance.min.js.map
