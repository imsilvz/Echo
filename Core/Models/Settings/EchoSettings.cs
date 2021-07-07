using System;
using System.Collections.Generic;

namespace Echo.Core.Models.Settings
{
    public class EchoSettings
    {
        public CommonSettings CommonSettings { get; set; }
        public object ChatlogSettings { get; set; }
        public object ListenerSettings { get; set; }
        public EchoSettings()
        {
            CommonSettings = new CommonSettings();
            ChatlogSettings = new object();
            ListenerSettings = new object();
            this.SetupDefaults();
        }

        private void SetupDefaults()
        {

        }
    }
}
