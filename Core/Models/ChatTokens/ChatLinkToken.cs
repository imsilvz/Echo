using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Echo.Core.Models.ChatTokens
{
    public class ChatLinkToken : ChatToken, IControlToken
    {
        // A ChatLinkToken is the pair of ChatLinkStartToken and ChatLinkEndToken
        private ChatLinkStartToken _startToken;
        private ChatLinkEndToken _endToken;
        private ChatSegmentToken _internalSegment;

        public ChatLinkToken(byte[] bytes) : base(bytes) { }

        public override bool Tokenize()
        {
            // find token start
            int offset = 0;
            _startToken = new ChatLinkStartToken(Data);
            if (!_startToken.Tokenize())
            {
                Debug.WriteLine("START TOKEN FAILED");
                return false;
            }

            // Normal Chat Link
            offset += _startToken.Length;

            // find token end
            byte[] offsetData = new byte[Data.Length - offset];
            Array.Copy(Data, offset, offsetData, 0, Data.Length - offset);
            _endToken = new ChatLinkEndToken(offsetData);
            if (!_endToken.Tokenize())
            {
                Debug.WriteLine("END TOKEN FAILED");
                return false;
            }

            // resize token
            byte[] tokenData = new byte[Data.Length - _endToken.Trimmed];
            Array.Copy(Data, 0, tokenData, 0, Data.Length - _endToken.Trimmed);
            this.Data = tokenData;
            this.Length = tokenData.Length;

            // find in-between tokens
            int betweenLength = Data.Length - _startToken.Length - _endToken.Length;
            byte[] betweenData = new byte[betweenLength];
            Array.Copy(Data, offset, betweenData, 0, betweenLength);
            _internalSegment = new ChatSegmentToken(betweenData);
            if (!_internalSegment.Tokenize())
            {
                Debug.WriteLine("BETWEEN TOKEN FAILED");
                return false;
            }
            return true;
        }

        public override string BuildMessage()
        {
            return $"[Link({_internalSegment.BuildMessage()})]";
        }

        public string GetTokenType()
        {
            return "";
        }

        public string GetTokenValue()
        {
            return "";
        }

        public string GetTokenText()
        {
            if(_internalSegment is not null)
            {
                var tokens = _internalSegment.GetTokens();
                foreach(var token in tokens)
                {
                    // find the text entry!
                    if(token is ChatTextToken)
                    {
                        return ((ChatTextToken)token).GetTokenValue();
                    }
                }
            }
            return "";
        }
    }
}
