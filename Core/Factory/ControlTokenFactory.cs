using System;
using System.IO;
using System.Diagnostics;

using Echo.Core.Models.ChatTokens;
namespace Echo.Core.Factory
{
    public class ControlTokenFactory
    {
        public static IControlToken GetToken(BinaryReader reader)
        {
            byte[] tokenBytes;
            IControlToken token = null;
            long startPos = reader.BaseStream.Position;
            long streamLength = reader.BaseStream.Length;

            byte controlType = reader.ReadByte();
            //Debug.WriteLine($"Control Token Type: {controlType.ToString("X2")}");
            // read remainder and then seek back to origin
            reader.BaseStream.Seek(-2, SeekOrigin.Current);
            switch(controlType)
            {
                case 0x01:
                    // skip this token!
                    break;
                case 0x12:
                    // Chat Icon
                    tokenBytes = reader.ReadBytes(
                        (int)(streamLength - (startPos - 1))
                    );
                    token = new ChatIconToken(tokenBytes);
                    break;
                case 0x27:
                    // Chat Link (unknown initial length)
                    tokenBytes = reader.ReadBytes(
                        (int)(streamLength - (startPos - 1))
                    );
                    token = new ChatLinkToken(tokenBytes);
                    break;
                default:
                    // Unknown token type
                    tokenBytes = reader.ReadBytes(
                        (int)(streamLength - (startPos - 1))
                    );
                    token = new GenericControlToken(tokenBytes);
                    break;
            }

            // reset handle unless we intentionally skipped!
            if(token is not null)
            {
                if (!((ChatToken)token).Tokenize())
                    return null;
                reader.BaseStream.Seek((startPos - 1) + ((ChatToken)token).Length, SeekOrigin.Begin);
            }
            return token;
        }
    }
}
