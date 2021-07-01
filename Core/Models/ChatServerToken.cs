using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models
{
    public class ChatServerToken : ControlToken
    {
        public string ServerName { get; set; }
        public override string ToString()
        {
            return $"ChatServerToken: {ServerName}";
        }
    }
}
