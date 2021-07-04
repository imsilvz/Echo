using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models
{
    public class ChatLink
    {
        public string UUID { get; set; }
        public int StartIndex { get; set; }
        public int Length { get; set; }
        public string Content { get; set; }
    }
}
