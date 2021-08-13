using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models.Settings
{
    public class ChatTypeSetting
    {
        public string ChatType { get; set; }
        public string Name { get; set; }
        public bool IsBattle { get; set; } = false;
        public bool IsSystem { get; set; } = false;
        public bool IsRpChat { get; set; } = false;
        public bool NameHighlight { get; set; } = false;
        public bool ShowChannelName { get; set; } = false;
        public string Color { get; set; } = "#F7F7F7";
    }

    public class JobInfoSetting
    {
        public string Acronym { get; set; }
        public string BaseJob { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }

        public JobInfoSetting() { }
        public JobInfoSetting(string acro, string name)
        {
            Acronym = acro;
            Name = name;
        }
        public JobInfoSetting(string acro, string baseJob, string name) : this(acro, name)
        {
            BaseJob = baseJob;
        }
        public JobInfoSetting(string acro, string baseJob, string name, string color) : this(acro, baseJob, name)
        {
            Color = color;
        }
    }

    public class CommonSettings
    {
        public Dictionary<string, ChatTypeSetting> ChatTypes { get; set; }
        public bool JobColorsEnabled { get; set; }
        public Dictionary<string, JobInfoSetting> JobInfo { get; set; }
        public CommonSettings() 
        {
            this.SetupDefaults();
        }

        private void SetupDefaults()
        {
            this.SetupDefaultChatTypes();
            this.SetupDefaultJobInfo();
        }

        private void SetupDefaultChatTypes()
        {
            ChatTypes = new Dictionary<string, ChatTypeSetting>();

            // Standard Chat Messages
            ChatTypes.Add("000A", new ChatTypeSetting()
            {
                Name = "Say",
                IsRpChat = true,
                NameHighlight = true,
            });
            ChatTypes.Add("000B", new ChatTypeSetting()
            {
                Name = "Shout",
                Color = "#FFA666"
            });
            ChatTypes.Add("000C", new ChatTypeSetting()
            {
                Name = "Tell (Outgoing)",
                Color = "#FFB8DE",
                NameHighlight = true,
            });
            ChatTypes.Add("000D", new ChatTypeSetting()
            {
                Name = "Tell (Incoming)",
                Color = "#FFB8DE",
                NameHighlight = true,
            });
            ChatTypes.Add("000E", new ChatTypeSetting()
            {
                Name = "Party",
                Color = "#66E5FF",
                IsRpChat = true,
                NameHighlight = true,
            });
            ChatTypes.Add("001C", new ChatTypeSetting()
            {
                Name = "Emote",
                Color = "#BAFFF0",
                IsRpChat = true,
                NameHighlight = true,
            });
            ChatTypes.Add("001D", new ChatTypeSetting()
            {
                Name = "AnimatedEmote",
                Color = "#BAFFF0",
                IsRpChat = true,
                NameHighlight = true,
            });
            ChatTypes.Add("001E", new ChatTypeSetting()
            {
                Name = "Yell",
                Color = "#FFFF00"
            });
            ChatTypes.Add("0025", new ChatTypeSetting()
            {
                Name = "CWLS1",
                Color = "#D4FF7D",
                ShowChannelName = true,
            });

            // Special Chat Channel
            ChatTypes.Add("003D", new ChatTypeSetting()
            {
                Name = "NpcDialogue",
            });
            ChatTypes.Add("001B", new ChatTypeSetting()
            {
                Name = "Novice", // Novice Network
                Color = "#D4FF7D"
            });

            // System
            ChatTypes.Add("0003", new ChatTypeSetting()
            {
                Name = "Welcome",
                Color = "#B38CFF",
                IsSystem = true,
            });
            ChatTypes.Add("0038", new ChatTypeSetting()
            {
                Name = "Echo",
                Color = "#CCCCCC",
                IsSystem = true,
            });
            ChatTypes.Add("0039", new ChatTypeSetting()
            {
                Name = "System",
                Color = "#CCCCCC",
                IsSystem = true
            });
            ChatTypes.Add("003C", new ChatTypeSetting()
            {
                Name = "Error", // "That function cannot be performed with characters on the free trial."
                IsSystem = true,
            });
            ChatTypes.Add("0044", new ChatTypeSetting()
            {
                Name = "Error", // Fate Error Message?
                IsSystem = true
            });
            ChatTypes.Add("0047", new ChatTypeSetting()
            {
                Name = "MarketBoard",
                IsSystem = true,
                Color = "#CCCCCC",
            });
            ChatTypes.Add("0048", new ChatTypeSetting()
            {
                Name = "PartyFinder",
                Color = "#CCCCCC",
                IsSystem = true,
            });
            ChatTypes.Add("0839", new ChatTypeSetting()
            {
                Name = "JobChange",
                Color = "#CCCCCC",
                IsSystem = true,
            });
            ChatTypes.Add("0840", new ChatTypeSetting()
            {
                Name = "ExperienceGain",
                Color = "#FFDE73",
                IsSystem = true,
            });
            ChatTypes.Add("0841", new ChatTypeSetting()
            {
                Name = "LocalLootRoll",
                IsSystem = true,
            });
            ChatTypes.Add("083E", new ChatTypeSetting()
            {
                Name = "BonusReward",
                Color = "#FFFFB0",
                IsSystem = true,
            });
            ChatTypes.Add("1040", new ChatTypeSetting()
            {
                Name = "Achievement", // Achievement
                Color = "#FFDE73",
                IsSystem = true,
            });
            ChatTypes.Add("1041", new ChatTypeSetting()
            {
                Name = "PlayerLootRoll", // Achievement
                IsSystem = true,
            });
            ChatTypes.Add("2040", new ChatTypeSetting()
            {
                Name = "LevelUp", // Achievement / Level Up
                Color = "#FFDE73",
                IsSystem = true,
            });

            ChatTypes.Add("0842", new ChatTypeSetting()
            {
                Name = "CraftingMessage",
                Color = "#DEBFF7",
                IsSystem = true,
            });
            ChatTypes.Add("08C2", new ChatTypeSetting()
            {
                Name = "LocalSynthesize",
                Color = "#DEBFF7",
                IsSystem = true,
            });
            ChatTypes.Add("2042", new ChatTypeSetting()
            {
                Name = "Synthesize", // Crafting!
                Color = "#DEBFF7",
                IsSystem = true,
            });

            // Battle
            ChatTypes.Add("082B", new ChatTypeSetting()
            {
                Name = "LocalUseAction",
                IsBattle = true
            });
            ChatTypes.Add("08AE", new ChatTypeSetting()
            {
                Name = "LocalGainStatus",
                IsBattle = true
            });
            ChatTypes.Add("08B0", new ChatTypeSetting()
            {
                Name = "LocalLoseStatus",
                IsBattle = true
            });
            ChatTypes.Add("082C", new ChatTypeSetting()
            {
                Name = "LocalUseItem",
                IsBattle = true,
            });
            ChatTypes.Add("0B29", new ChatTypeSetting()
            {
                Name = "LocalDamageDealt",
                IsBattle = true
            });
            ChatTypes.Add("0AA9", new ChatTypeSetting()
            {
                Name = "LocalCriticalDealt",
                IsBattle = true
            });
            ChatTypes.Add("0AAB", new ChatTypeSetting()
            {
                Name = "LocalBeginCast",
                IsBattle = true
            });
        }

        private void SetupDefaultJobInfo()
        {
            JobColorsEnabled = true;
            var JobInfoList = new List<JobInfoSetting>();
            // base classes
            JobInfoList.Add(new JobInfoSetting("Unknown", "Unknown"));
            JobInfoList.Add(new JobInfoSetting("GLD", null, "Gladiator", "#7FDBFF"));
            JobInfoList.Add(new JobInfoSetting("PGL", null, "Pugilist", "#d5c400"));
            JobInfoList.Add(new JobInfoSetting("MRD", null, "Marauder", "#FF4136"));
            JobInfoList.Add(new JobInfoSetting("LNC", null, "Lancer", "#33A0FF"));
            JobInfoList.Add(new JobInfoSetting("ARC", null, "Archer", "#01FF70"));
            JobInfoList.Add(new JobInfoSetting("CNJ", null, "Conjurer", "#FFFFE8"));
            JobInfoList.Add(new JobInfoSetting("THM", null, "Thaumaturge", "#E365F6"));
            JobInfoList.Add(new JobInfoSetting("ACN", "Arcanist"));

            // DoH / DoL
            JobInfoList.Add(new JobInfoSetting("CPT", "Carpenter"));
            JobInfoList.Add(new JobInfoSetting("BSM", "Blacksmith"));
            JobInfoList.Add(new JobInfoSetting("ARM", "Armorer"));
            JobInfoList.Add(new JobInfoSetting("GSM", "Goldsmith"));
            JobInfoList.Add(new JobInfoSetting("LTW", "Leatherworker"));
            JobInfoList.Add(new JobInfoSetting("WVR", "Weaver"));
            JobInfoList.Add(new JobInfoSetting("ALC", "Alchemist"));
            JobInfoList.Add(new JobInfoSetting("CUL", "Culinarian"));
            JobInfoList.Add(new JobInfoSetting("MIN", "Miner"));
            JobInfoList.Add(new JobInfoSetting("BTN", "Botanist"));
            JobInfoList.Add(new JobInfoSetting("FSH", "Fisher"));

            // DoW/DoM
            JobInfoList.Add(new JobInfoSetting("PLD", "GLD", "Paladin"));
            JobInfoList.Add(new JobInfoSetting("MNK", "PGL", "Monk"));
            JobInfoList.Add(new JobInfoSetting("WAR", "MRD", "Warrior"));
            JobInfoList.Add(new JobInfoSetting("DRG", "LNC", "Dragoon"));
            JobInfoList.Add(new JobInfoSetting("BRD", "ARC", "Bard"));
            JobInfoList.Add(new JobInfoSetting("WHM", "CNJ", "White Mage"));
            JobInfoList.Add(new JobInfoSetting("BLM", "THM", "Black Mage"));
            JobInfoList.Add(new JobInfoSetting("SMN", "ACN", "Summoner", "#2ECC40"));
            JobInfoList.Add(new JobInfoSetting("SCH", "ACN", "Scholar", "#bba9cd"));
            JobInfoList.Add(new JobInfoSetting("ROG", null, "Rogue", "#A796AB"));
            JobInfoList.Add(new JobInfoSetting("NIN", "ROG", "Ninja"));
            JobInfoList.Add(new JobInfoSetting("MCH", null, "Machinist", "#DBF7FF"));
            JobInfoList.Add(new JobInfoSetting("DRK", null, "Dark Knight", "#f79414"));
            JobInfoList.Add(new JobInfoSetting("AST", null, "Astrologian", "#edd25f"));
            JobInfoList.Add(new JobInfoSetting("SAM", null, "Samurai", "#b8b3b1"));
            JobInfoList.Add(new JobInfoSetting("RDM", null, "Red Mage", "#EB9EBA"));
            JobInfoList.Add(new JobInfoSetting("BLU", "Blue Mage"));
            JobInfoList.Add(new JobInfoSetting("GNB", null, "Gunbreaker", "#f0b885"));
            JobInfoList.Add(new JobInfoSetting("DNC", null, "Dancer", "#f8d3c9"));

            JobInfo = new Dictionary<string, JobInfoSetting>();
            foreach (var item in JobInfoList)
            {
                JobInfo.Add(item.Acronym, item);
            }
        }
    }
}
