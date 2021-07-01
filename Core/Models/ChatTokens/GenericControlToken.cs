using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models.ChatTokens
{
    public class GenericControlToken : ChatToken, IControlToken
    {
        public GenericControlToken(byte[] bytes) : base(bytes) { }

        public override bool Tokenize()
        {
            // find proper size
            byte[] initialData = Data;
            int idx = 2;
            int tokenLength = idx + Data[idx] + 1;
            byte[] tokenData = new byte[tokenLength];
            Array.Copy(Data, 0, tokenData, 0, tokenLength);
            this.Data = tokenData;
            this.Length = tokenLength;
            return base.Tokenize();
        }

        public override string BuildMessage()
        {
            string hex = BitConverter.ToString(Data)
                .Replace("-", string.Empty);
            return $"[CONTROLTOKEN:{hex}]";
        }
    }
}
