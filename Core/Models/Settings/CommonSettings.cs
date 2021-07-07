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
        public bool IsBattle { get; set; }
        public bool IsSystem { get; set; }
        public bool IsRpChat { get; set; }
        public bool NameHighlight { get; set; }
        public string Color { get; set; }
    }

    public class CommonSettings
    {
        public Dictionary<string, ChatTypeSetting> ChatTypes { get; set; }
        public bool JobColorsEnabled { get; set; }
        public Dictionary<string, JobInfoItem> JobInfo { get; set; }
        public CommonSettings() 
        {
            ChatTypes = new Dictionary<string, ChatTypeSetting>();
            JobInfo = new Dictionary<string, JobInfoItem>();
            this.SetupDefaults();
        }

        private void SetupDefaults()
        {
            JobColorsEnabled = true;
            var JobInfoList = new List<JobInfoItem>();
            // base classes
            JobInfoList.Add(new JobInfoItem("Unknown", "Unknown"));
            JobInfoList.Add(new JobInfoItem("GLD", null, "Gladiator", "#7FDBFF"));
            JobInfoList.Add(new JobInfoItem("PGL", null, "Pugilist", "#d5c400"));
            JobInfoList.Add(new JobInfoItem("MRD", null, "Marauder", "#FF4136"));
            JobInfoList.Add(new JobInfoItem("LNC", null, "Lancer", "#33A0FF"));
            JobInfoList.Add(new JobInfoItem("ARC", null, "Archer", "#01FF70"));
            JobInfoList.Add(new JobInfoItem("CNJ", null, "Conjurer", "#FFFFE8"));
            JobInfoList.Add(new JobInfoItem("THM", null, "Thaumaturge", "#E365F6"));
            JobInfoList.Add(new JobInfoItem("ACN", "Arcanist"));

            // DoH / DoL
            JobInfoList.Add(new JobInfoItem("CPT", "Carpenter"));
            JobInfoList.Add(new JobInfoItem("BSM", "Blacksmith"));
            JobInfoList.Add(new JobInfoItem("ARM", "Armorer"));
            JobInfoList.Add(new JobInfoItem("GSM", "Goldsmith"));
            JobInfoList.Add(new JobInfoItem("LTW", "Leatherworker"));
            JobInfoList.Add(new JobInfoItem("WVR", "Weaver"));
            JobInfoList.Add(new JobInfoItem("ALC", "Alchemist"));
            JobInfoList.Add(new JobInfoItem("CUL", "Culinarian"));
            JobInfoList.Add(new JobInfoItem("MIN", "Miner"));
            JobInfoList.Add(new JobInfoItem("BTN", "Botanist"));
            JobInfoList.Add(new JobInfoItem("FSH", "Fisher"));

            // DoW/DoM
            JobInfoList.Add(new JobInfoItem("PLD", "GLD", "Paladin"));
            JobInfoList.Add(new JobInfoItem("MNK", "PGL", "Monk"));
            JobInfoList.Add(new JobInfoItem("WAR", "MRD", "Warrior"));
            JobInfoList.Add(new JobInfoItem("DRG", "LNC", "Dragoon"));
            JobInfoList.Add(new JobInfoItem("BRD", "ARC", "Bard"));
            JobInfoList.Add(new JobInfoItem("WHM", "CNJ", "White Mage"));
            JobInfoList.Add(new JobInfoItem("BLM", "THM", "Black Mage"));
            JobInfoList.Add(new JobInfoItem("SMN", "ACN", "Summoner", "#2ECC40"));
            JobInfoList.Add(new JobInfoItem("SCH", "ACN", "Scholar", "#bba9cd"));
            JobInfoList.Add(new JobInfoItem("ROG", null, "Rogue", "#A796AB"));
            JobInfoList.Add(new JobInfoItem("NIN", "ROG", "Ninja"));
            JobInfoList.Add(new JobInfoItem("MCH", null, "Machinist", "#DBF7FF"));
            JobInfoList.Add(new JobInfoItem("DRK", null, "Dark Knight", "#f79414"));
            JobInfoList.Add(new JobInfoItem("AST", null, "Astrologian", "#edd25f"));
            JobInfoList.Add(new JobInfoItem("SAM", null, "Samurai", "#b8b3b1"));
            JobInfoList.Add(new JobInfoItem("RDM", null, "Red Mage", "#EB9EBA"));
            JobInfoList.Add(new JobInfoItem("BLU", "Blue Mage"));
            JobInfoList.Add(new JobInfoItem("GNB", null, "Gunbreaker", "#f0b885"));
            JobInfoList.Add(new JobInfoItem("DNC", null, "Dancer", "#f8d3c9"));

            foreach (var item in JobInfoList)
            {
                JobInfo.Add(item.Acronym, item);
            }
        }
    }
}
