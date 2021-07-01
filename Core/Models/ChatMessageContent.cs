using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Models
{
    public class ChatMessageContent
    {
        public byte[] Bytes { get; set; }
        public ChatMessageContent(ChatSegmentToken token)
        {
            this.Bytes = token.Data;
        }
    }
}
