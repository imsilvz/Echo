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
        public Dictionary<string, ChatTypeSetting> ChatTypeSettings { get; set; }
        public CommonSettings() 
        {
            ChatTypeSettings = new Dictionary<string, ChatTypeSetting>();
            this.SetupDefaults();
        }

        private void SetupDefaults()
        {

        }
    }
}
