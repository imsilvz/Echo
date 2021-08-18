using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Enum.FFXIV
{
    public enum ChatType : ushort
    {
        // All Chat Types!
        // Battle
        LocalUseAction      = 0x082B,
        LocalReadyAction    = 0x08AB,
        LocalGainStatus     = 0x08AE,
        LocalLoseStatus     = 0x08B0,
        LocalUseItem        = 0x082C,

        LocalDamageDealt    = 0x0B29,
        LocalBeginCast      = 0x0B2B,
        LocalDefeatEnemy    = 0x0B3A,
        LocalCriticalDealt  = 0x0AA9,
        LocalNoEffect       = 0x08AA,
        LocalBeginSelfCast  = 0x0AAB,
        LocalHeal           = 0x08AD,

        EnemyUseAction      = 0x282B,
        LocalEnemyHit       = 0x28A9,
        LocalEnemyMiss      = 0x28AA,

        // Chat
        Say                 = 0x000A,
        Shout               = 0x000B,
        SendTell            = 0x000C,
        RecvTell            = 0x000D,
        Party               = 0x000E,

        Emote               = 0x001C,
        AnimEmote           = 0x001D,
        Yell                = 0x001E,

        CWLS1               = 0x0025,

        // Special
        NpcDialogue         = 0x003D,
        NoviceNetwork       = 0x001B,

        // System
        WelcomeMessage      = 0x0003,
        EchoMessage         = 0x0038,
        SystemMessage       = 0x0039,
        GatheringNotice     = 0x003B, //"003B::You sense an unknown grade rocky outcrop 133 yalms to the southeast."
        CraftingMessage     = 0x0842,
        GatheringMessage    = 0x0843,
        GatheringNotice2    = 0x083B,
        SystemError1        = 0x003C,
        SystemError2        = 0x0044,
        MarketboardMessage  = 0x0047,
        PartyFinderMessage  = 0x0048,
        JobChange           = 0x0839,
        ExperienceGain      = 0x0840,
        LocalLootRoll       = 0x0841,
        BonusReward         = 0x083E,
        LocalSythesize      = 0x08C2,
        PlayerAchievement   = 0x1040, // level up or achievement
        PlayerLootRoll      = 0x1041,
        PlayerLevelUp       = 0x2040, // level up or achievement
        Synthesize          = 0x2042,
    }

    public enum StandardChatType : ushort
    {
        Say = 0x000A,
        Shout = 0x00B,
        SendTell = 0x000C,
        RecvTell = 0x000D,
        Party = 0x000E,

        Emote = 0x001C,
        AnimEmote = 0x001D,
        Yell = 0x001E,

        CWLS1 = 0x0025,

        NpcDialogue = 0x003D,
    }

    public enum SpecialChatType : ushort
    {
        NoviceNetwork = 0x001B,
    }
}
