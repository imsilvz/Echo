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
        LocalGainStatus     = 0x08AE,
        LocalLoseStatus     = 0x08B0,

        LocalDamageDealt    = 0x0B29,
        LocalCriticalDealt  = 0x0AA9,
        LocalBeginCast      = 0x0AAB,

        DefeatEnemy         = 0x0B3A,

        // Chat
        Say                 = 0x000A,
        Shout               = 0x00B,
        SendTell            = 0x000C,
        RecvTell            = 0x000D,
        Party               = 0x000E,

        Emote               = 0x001C,
        AnimEmote           = 0x001D,
        Yell                = 0x001E,

        // Special
        NoviceNetwork       = 0x001B,

        // System
        WelcomeMessage      = 0x0003,
        SystemMessage       = 0x0039,
        SystemError         = 0x0044,
        PartyFinderMessage  = 0x0048,
        JobChange           = 0x0839,
        ExperienceGain      = 0x0840,
        LocalLootRoll       = 0x0841,
        BonusReward         = 0x083E,
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
        Yell = 0x001E
    }

    public enum SpecialChatType : ushort
    {
        NoviceNetwork = 0x001B,
    }
}
