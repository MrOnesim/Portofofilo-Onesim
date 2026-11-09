// Ressources média servies depuis public/media/ (AVIF / WebP / repli JPEG).
// Généré par scripts/extract-media.mjs — ne pas éditer à la main.
export const MEDIA = {
  architect: "/media/architect.jpg",
  cdacs: "/media/cdacs.jpg",
  cipbg: "/media/cipbg.jpg",
  connexdon: "/media/connexdon.jpg",
  desk: "/media/desk.jpg",
  employra: "/media/employra.jpg",
  futurcraft: "/media/futurcraft.jpg",
  gbc: "/media/gbc.jpg",
  gen3rvto: "/media/gen3rvto.jpg",
  hadibaba: "/media/hadibaba.jpg",
  kpondehou: "/media/kpondehou.jpg",
  nounagnon: "/media/nounagnon.jpg",
  novatech: "/media/novatech.jpg",
  ocd: "/media/ocd.jpg",
  portrait: "/media/portrait.jpg",
  vanobaby: "/media/vanobaby.jpg",
} as const;

export type MediaKey = keyof typeof MEDIA;

export const MEDIA_DIMS: Record<MediaKey, { width: number; height: number }> = {
  architect: { width: 1200, height: 675 },
  cdacs: { width: 1200, height: 532 },
  cipbg: { width: 1200, height: 611 },
  connexdon: { width: 1200, height: 609 },
  desk: { width: 1200, height: 800 },
  employra: { width: 1200, height: 522 },
  futurcraft: { width: 1200, height: 607 },
  gbc: { width: 1200, height: 609 },
  gen3rvto: { width: 1200, height: 606 },
  hadibaba: { width: 1200, height: 750 },
  kpondehou: { width: 1200, height: 617 },
  nounagnon: { width: 1200, height: 614 },
  novatech: { width: 1200, height: 608 },
  ocd: { width: 1200, height: 620 },
  portrait: { width: 960, height: 1200 },
  vanobaby: { width: 1200, height: 604 },
};

export type MediaVariant = { width: number; avif: string; webp: string };
export const MEDIA_VARIANTS: Record<MediaKey, MediaVariant[]> = {
  architect: [{"width":480,"avif":"/media/architect-480.avif","webp":"/media/architect-480.webp"},{"width":800,"avif":"/media/architect-800.avif","webp":"/media/architect-800.webp"},{"width":1200,"avif":"/media/architect-1200.avif","webp":"/media/architect-1200.webp"}],
  cdacs: [{"width":480,"avif":"/media/cdacs-480.avif","webp":"/media/cdacs-480.webp"},{"width":800,"avif":"/media/cdacs-800.avif","webp":"/media/cdacs-800.webp"},{"width":1200,"avif":"/media/cdacs-1200.avif","webp":"/media/cdacs-1200.webp"}],
  cipbg: [{"width":480,"avif":"/media/cipbg-480.avif","webp":"/media/cipbg-480.webp"},{"width":800,"avif":"/media/cipbg-800.avif","webp":"/media/cipbg-800.webp"},{"width":1200,"avif":"/media/cipbg-1200.avif","webp":"/media/cipbg-1200.webp"}],
  connexdon: [{"width":480,"avif":"/media/connexdon-480.avif","webp":"/media/connexdon-480.webp"},{"width":800,"avif":"/media/connexdon-800.avif","webp":"/media/connexdon-800.webp"},{"width":1200,"avif":"/media/connexdon-1200.avif","webp":"/media/connexdon-1200.webp"}],
  desk: [{"width":480,"avif":"/media/desk-480.avif","webp":"/media/desk-480.webp"},{"width":800,"avif":"/media/desk-800.avif","webp":"/media/desk-800.webp"},{"width":1200,"avif":"/media/desk-1200.avif","webp":"/media/desk-1200.webp"}],
  employra: [{"width":480,"avif":"/media/employra-480.avif","webp":"/media/employra-480.webp"},{"width":800,"avif":"/media/employra-800.avif","webp":"/media/employra-800.webp"},{"width":1200,"avif":"/media/employra-1200.avif","webp":"/media/employra-1200.webp"}],
  futurcraft: [{"width":480,"avif":"/media/futurcraft-480.avif","webp":"/media/futurcraft-480.webp"},{"width":800,"avif":"/media/futurcraft-800.avif","webp":"/media/futurcraft-800.webp"},{"width":1200,"avif":"/media/futurcraft-1200.avif","webp":"/media/futurcraft-1200.webp"}],
  gbc: [{"width":480,"avif":"/media/gbc-480.avif","webp":"/media/gbc-480.webp"},{"width":800,"avif":"/media/gbc-800.avif","webp":"/media/gbc-800.webp"},{"width":1200,"avif":"/media/gbc-1200.avif","webp":"/media/gbc-1200.webp"}],
  gen3rvto: [{"width":480,"avif":"/media/gen3rvto-480.avif","webp":"/media/gen3rvto-480.webp"},{"width":800,"avif":"/media/gen3rvto-800.avif","webp":"/media/gen3rvto-800.webp"},{"width":1200,"avif":"/media/gen3rvto-1200.avif","webp":"/media/gen3rvto-1200.webp"}],
  hadibaba: [{"width":480,"avif":"/media/hadibaba-480.avif","webp":"/media/hadibaba-480.webp"},{"width":800,"avif":"/media/hadibaba-800.avif","webp":"/media/hadibaba-800.webp"},{"width":1200,"avif":"/media/hadibaba-1200.avif","webp":"/media/hadibaba-1200.webp"}],
  kpondehou: [{"width":480,"avif":"/media/kpondehou-480.avif","webp":"/media/kpondehou-480.webp"},{"width":800,"avif":"/media/kpondehou-800.avif","webp":"/media/kpondehou-800.webp"},{"width":1200,"avif":"/media/kpondehou-1200.avif","webp":"/media/kpondehou-1200.webp"}],
  nounagnon: [{"width":480,"avif":"/media/nounagnon-480.avif","webp":"/media/nounagnon-480.webp"},{"width":800,"avif":"/media/nounagnon-800.avif","webp":"/media/nounagnon-800.webp"},{"width":1200,"avif":"/media/nounagnon-1200.avif","webp":"/media/nounagnon-1200.webp"}],
  novatech: [{"width":480,"avif":"/media/novatech-480.avif","webp":"/media/novatech-480.webp"},{"width":800,"avif":"/media/novatech-800.avif","webp":"/media/novatech-800.webp"},{"width":1200,"avif":"/media/novatech-1200.avif","webp":"/media/novatech-1200.webp"}],
  ocd: [{"width":480,"avif":"/media/ocd-480.avif","webp":"/media/ocd-480.webp"},{"width":800,"avif":"/media/ocd-800.avif","webp":"/media/ocd-800.webp"},{"width":1200,"avif":"/media/ocd-1200.avif","webp":"/media/ocd-1200.webp"}],
  portrait: [{"width":480,"avif":"/media/portrait-480.avif","webp":"/media/portrait-480.webp"},{"width":800,"avif":"/media/portrait-800.avif","webp":"/media/portrait-800.webp"}],
  vanobaby: [{"width":480,"avif":"/media/vanobaby-480.avif","webp":"/media/vanobaby-480.webp"},{"width":800,"avif":"/media/vanobaby-800.avif","webp":"/media/vanobaby-800.webp"},{"width":1200,"avif":"/media/vanobaby-1200.avif","webp":"/media/vanobaby-1200.webp"}],
};

/** Miniatures 24px pour fond flouté pendant le chargement. */
export const MEDIA_LQIP: Record<MediaKey, string> = {
  architect: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoYAA0APwFurU6rJqQiMAgBYCAJZACdAGlfNAT/w29qPUAA/v3avZW4Isbb0nKJ4t7Q5gP37XSMv7HNQ85cL2MYn1WeAAAA",
  cdacs: "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAADQAwCdASoYAAsAPwFqrU6rJiQiMAgBYCAJbACdACHVXCuhEypuMAAA/I/JnWvyZIoQT9YjjcmtnZEKuH5WEvrScwYQyYrOUwHaPgR+xRawJGq2ODUPdv57fTQ4EIphBYZCpzby0O+IJ8CPFpY3UquL4DJFaCBLgAA=",
  cipbg: "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADQAwCdASoYAAwAPwFqr0+rJiQiMAgBYCAJQBOmUABp2uCCcLLnQAAA8qI8J9E1U36RvAi8QYNqFH4mqkzYj4b2GpvmYa3Sbygw5mwBxE9hiSY3rD06SLQRUhh+ld6vUVB+/gJ7oXlIhCAwUiAAAA==",
  connexdon: "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAAAQBACdASoYAAwAPwFqrE6rJiQiMAgBYCAJZwDCgB6P5jiJ6/wdm+GCAAD+y9ztgl7yjoxyGELIcZohCO4GL/a/p6W7WtAoijFfdzaSmgR/UD2W6AlxqQEvuD3FcL9Oc1PW7c/HNp27jSrY645oNxd82gAAAA==",
  desk: "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAACwAwCdASoYABAAPwFqrE6rJiQiMAgBYCAJaAC06B49w0mv92QxwAD+2arS4ZRRAqzvLyjigEXYgdvge8qibkDows144LeWkrku51FYlZGzUPlG+VcWaGE0FrF3YWWFplKlWyXyk/AAAA==",
  employra: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAwCdASoYAAoAPwFqrE6rJiQiMAgBYCAJZACdMoADTrqdVDz73wAA+6Mqu38pGkfakw1jvGS00AfMBy1q4/CSl/JgdqDUXfE+XNfS8qPlVaKNlR75lQThWsoljfNjJkerTvGXYVcOpGwwAAA=",
  futurcraft: "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAAAwBACdASoYAAwAPwFqrE6rJiQiMAgBYCAJYgCdACKPXRjHXxLFSFppWAAA/fBkDfDBrfLLiwPBweSInJbGUQDmLT9vTe9s26Zsg+7eKYb7csG4TfQ+AhUXiiectzKtZ6PxpbWMf2LdR+IxnI7NYtX2eXrYAK0Py8auiu0D2HvKmx8JqCamt/FInAcqSrr8wAA=",
  gbc: "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAAAwBACdASoYAAwAPwForE6rJaQiMAgBYCAJZADE2CHfJdDPSl0jt6fKQAAA/u9TMnCIFBlkKDxJqd1OH/vCvrnXERuJJx1WV7IFW8zcWe1m6V9xPbGn8KOiaytF7hmEWzG3mssnEcdzDW95Rq/ufKWr7EY5raKiSAA=",
  gen3rvto: "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAACwAwCdASoYAAwAPwForE6rJaQiMAgBYCAJZQAAWkqvFfhX+OTcAAD+6jHMpLbFxhuZA3IT8obxEAZD7wE1FkPXmdiGJcJDOGdj4iQvmxB+9dtaJcCgwzqXeMvk15jj6Hh4l0FYAZ1T+AAA",
  hadibaba: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAgCdASoYAA8APwForE6rJaQiMAgBYCAJZQC06C0kAAD+78CSb7cElIdpA/KYCzQGVq9mhblOCAAA",
  kpondehou: "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAABQBACdASoYAAwAPwF6sFCrKKSisAgBYCAJagCdMoAKRp85zOPgI2dNmeYAAP68n+8ngGRIjqxLirL034HGqdjFs/6agVjLgEozRd7PuVoJFIePSsJwuFsflHZ/T5djDIPVvKs6U0bHtU2JkQ1lOtjIyJL8cYKWdcVTkrP67WhqVdxcHPcpTqJSKDJSCHE9oEzxomgA",
  nounagnon: "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADQAwCdASoYAAwAPwFqrE8rJiQiMAgBYCAJZwAAXJl0Jc+aycXTFiAA99i0e7z5fULD68wy4Skwag6qqpIe3RIG2S8dRvhhz+ahEZARP2eIz5NKWs40T4JsWDt4AA==",
  novatech: "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADwAwCdASoYAAwAPwFqrE6rJiQiMAgBYCAJaQAAUrmiaa3FJvzcfZMAAP7uwqDQQEYze1FBY8im5oanwXGZXc1G37+F7CsmI9W/iKqa6Tyy71NkMYUlMwi1Td9+gabP55+MkohYWOURPDxG/AgAAA==",
  ocd: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAABwBACdASoYAAwAPwFsrU8rJiQiMAgBYCAJYgCdOUC2tgK7txGIn/PIvMl1YAD+7A8fholsi2dAqf+HIJ+g8Lvgo9gRR2WAbMawtK0TCqytT8z9x0IXGXjSMAQ1isVA5q1etfuvaTowVxoPicgZRECLLPlVRLY+w1Xx/r5UzDVow4Rq+dTqj6AA",
  portrait: "data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAACQBQCdASoYAB4APu1kqE6ppaQiN/qoATAdiWUAv+wh8PVIX/RIcFFtzrEGRUb38Y0IE8xxwAD+7o7Uyy44V0Kv7SNx8nFeNSrhcZ2RYUyI8pzIT6w2ppY8cDVFTEqH4Ols2Rx2TvSNqgvrBjlpHNA0cwWCM1npMZERhUOz+/C6BZ/4N7WW/eqN4CHXmEoDmTvYW53CuAA=",
  vanobaby: "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAACQBACdASoYAAwAPwForE6rJaQiMAgBYCAJbACdMoR3ACPf+DlVMjLRf0Xbn4AA/kiUdr4SeualJ+TmPUWZmg9r3mlKZID7Ek8YyaDahdUFYPQh5zJLG7b5kXA3l5FJbnanJl+RtzEPgCqN7UY56xkrrM0wA5UR13J7ba04Gq07hSY87WfaBE1PplC82uJRdcW6FAAA",
};

export const mediaKeyFor = (src: string): MediaKey | undefined =>
  (Object.keys(MEDIA) as MediaKey[]).find((key) => MEDIA[key] === src);
