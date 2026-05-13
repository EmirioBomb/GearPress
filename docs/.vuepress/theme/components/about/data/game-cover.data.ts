export interface GameItem {
  name: string
  link: string
  href?: string
  alt?: string
  tags?: string[]
  platform?: string[]
}

export const gamesData: GameItem[] = [
  // BANDAI Namco Tales Series
  {
    name: "Tales of Phantasia",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/top.png",
    href: "https://tales-ch.jp/titles/top/",
    alt: "悲しみの涙を剣に変えて少年はいま 時間を超える･･････",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "solar:gameboy-bold", "lineicons:ios"]
  },
  {
    name: "Tales of Destiny",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tod.png",
    href: "https://tales-ch.jp/titles/tod/",
    alt: "運命という名のRPG",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "Tales of Eternia",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/toe.png",
    href: "https://tales-ch.jp/titles/toe/",
    alt: "変われる強さ 変わらぬ想い",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:nintendo-switch"]
  },
  {
    name: "Tales of Destiny 2",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tod2.png",
    href: "https://tales-ch.jp/titles/tod2/",
    alt: "時を超え、運命は次なる英雄を生んだ",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "Tales of Symphonia",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tos.png",
    href: "https://tales-ch.jp/titles/tos/",
    alt: "世界は救われる。彼女を失えば",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch"]
  },
  {
    name: "Tales of Rebirth",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tor.png",
    href: "https://tales-ch.jp/titles/tor/",
    alt: "ふたつの種族が織り成す再誕の物語",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "Tales of Legendia",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tol.png",
    href: "https://tales-ch.jp/titles/tol/",
    alt: "信じる思い。そのすべてを力に変えて",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "Tales of the Abyss",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tota.png",
    href: "https://tales-ch.jp/titles/toa/",
    alt: "何のために生まれて来たのか 何のために生きているのか",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "Tales of Symphonia: Dawn of the New World",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tos-ratatosk.png",
    href: "https://tales-ch.jp/titles/tosratatosk/",
    alt: "契約により与えられた戦う力。ただ君を 守りたかった―――",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "Tales of Vesperia",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tov.png",
    href: "https://tales-ch.jp/titles/tov/",
    alt: "それぞれの「正義」が動き出す",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "bi:xbox"]
  },
  {
    name: "Tales of Graces",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/togf.png",
    href: "https://tales-ch.jp/titles/tog/",
    alt: "守りたい人たちがいる。だから 強く 優しくなれる",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "mdi:nintendo-wiiu"]
  },
  {
    name: "Tales of Xillia",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tox.png",
    href: "https://tales-ch.jp/titles/tox/",
    alt: "それぞれの想いが重なるとき 揺るぎなき信念が未来を切り開く",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch"]
  },
  {
    name: "Tales of Xillia 2",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tox2.png",
    href: "https://tales-ch.jp/titles/tox2/",
    alt: "少女のために 世界を壊す覚悟はあるか？",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "Tales of Zestiria",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/toz.png",
    href: "https://tales-ch.jp/titles/toz/",
    alt: "伝承は いつしか「希望」になる",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam"]
  },
  {
    name: "Tales of Berseria",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/tob.png",
    href: "https://tales-ch.jp/titles/tob/",
    alt: "君が君らしく生きるためのRPG",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "bi:xbox"]
  },
  {
    name: "Tales of Arise",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/toa.png",
    href: "https://tales-ch.jp/titles/toarise/",
    alt: "心の黎明を告げるRPG",
    tags: ["JRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "bi:xbox"]
  },

  // G.U.N.D.A.M
  {
    name: "SD Gundam G Generation F",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ggf.png",
    alt: "ガンダムの軌跡、その集大成――",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "SD Gundam G Generation Spirits",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ggs.png",
    alt: "宇宙世紀、その魂がここに集う――",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block"]
  },
  {
    name: "SD Gundam G Generation Genesis",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ggg.png",
    href: "https://ggg.ggame.jp/",
    alt: "歴代ガンダム、ここに集結――",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:nintendo-switch"]
  },
  {
    name: "SD Gundam G Generation Cross Rays",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ggcr.png",
    href: "https://ggcr.ggame.jp/",
    alt: "創世記を経て、４つの新世紀が交差する――",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch"]
  },
  {
    name: "SD Gundam G Generation Eternal",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/gge.jpg",
    href: "https://gget.ggame.jp/jp/",
    alt: "歴代ガンダム作品の物語を追体験するシミュレーションゲーム",
    tags: ["SRPG", "JPN"],
    platform: ["lineicons:ios", "mingcute:android-fill", "basil:google-play-outline"]
  },

  // Final Fantasy Series
  {
    name: "Final Fantasy X",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ffx.png",
    href: "https://www.jp.square-enix.com/ffx_x-2HD/",
    alt: "祈りが紡ぐ、運命を超える旅",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "bi:xbox"]
  },
  {
    name: "Final Fantasy XIII",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ffxiii.png",
    href: "https://www.square-enix-games.com/en_EU/games/final-fantasy-xiii",
    alt: "ルシに刻まれた運命、その終焉と始まり",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "bi:xbox"]
  },
  {
    name: "Final Fantasy XIII-2",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ffxiii2.png",
    href: "https://www.square-enix-games.com/en_EU/games/final-fantasy-xiii-2",
    alt: "時を超えて交差する、もう一つの運命",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "bi:xbox"]
  },
  {
    name: "Final Fantasy XIII: Lightning Returns",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ffxiii3.png",
    href: "https://www.square-enix-games.com/en_EU/games/lightning-returns-final-fantasy-xiii",
    alt: "終末の13日間、光が導く最後の旅",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:nintendo-switch", "bi:xbox"]
  },
  {
    name: "Final Fantasy XV",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ffxv.png",
    href: "https://www.square-enix-games.com/en_EU/games/final-fantasy-xv",
    alt: "運命に抗う王と仲間たちの物語",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:xbox"]
  },
  {
    name: "Final Fantasy XVI",
    link: "https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/game-cover/ffxvi.png",
    href: "https://na.finalfantasyxvi.com/",
    alt: "魂に刻まれた戦火が、世界を揺るがす",
    tags: ["SRPG", "JPN"],
    platform: ["streamline-logos:playstation-logo-block", "bi:steam", "bi:xbox"]
  },
]