using System;
using System.Collections.Generic;

namespace Echo.Core.Models.Settings
{
    public class EchoSettings
    {
        public CommonSettings CommonSettings { get; set; }
        public ChatlogSettings ChatlogSettings { get; set; }
        public ListenerSettings ListenerSettings { get; set; }
        public EchoSettings()
        {
            CommonSettings = new CommonSettings();
            ChatlogSettings = new ChatlogSettings();
            ListenerSettings = new ListenerSettings();
            this.SetupDefaults();
        }

        private void SetupDefaults()
        {

        }
    }
}
