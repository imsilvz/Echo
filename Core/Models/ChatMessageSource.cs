using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessageSource
    {
        public byte[] Bytes { get; set; }
        public ChatMessageSource(ChatSegmentToken token)
        {
            this.Bytes = token.Data;
        }
    }
}
