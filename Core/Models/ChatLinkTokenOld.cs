using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models
{
    public class ChatLinkTokenOld : ControlToken
    {
        public string LinkType { get; set; }
        public string LinkValue { get; set; }

        public override string ToString()
        {
            return $"ChatLinkToken ({LinkType}): {LinkValue}";
        }
    }
}
