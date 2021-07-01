using System;
using System.IO;
using System.Diagnostics;

namespace Echo.Core.Models.ChatTokens
{
    public class ChatLinkEndToken : ChatToken
    {
        public int Trimmed { get; set; }
        public ChatLinkEndToken(byte[] bytes) : base(bytes) { }

        public override bool Tokenize()
        {
            using (var s = new MemoryStream(Data))
            {
                using (var reader = new BinaryReader(s))
                {
                    // since we are reading 2 bytes, only iterate until length - 1
                    long begin = s.Position;
                    while(s.Position < (s.Length - 1))
                    {
                        ushort b = reader.ReadUInt16();
                        s.Seek(-1, SeekOrigin.Current);
                        //Debug.WriteLine($"({b == 0x2702}) {b.ToString("X2")} == {0x2702.ToString("X2")}");
                        
                        // 0x02 0x27 little endian
                        if (b == 0x2702)
                        {
                            break;
                        }
                    }
                    s.Seek(-1, SeekOrigin.Current);

                    // extract token data from remainder
                    byte[] remainder = reader.ReadBytes((int) (s.Length - s.Position));

                    // and then fix the length
                    int idx = 2;
                    int tokenLength = idx + remainder[idx] + 1;
                    byte[] tokenData = new byte[tokenLength];
                    Array.Copy(remainder, 0, tokenData, 0, tokenLength);
                    this.Data = tokenData;
                    this.Length = tokenLength;
                    this.Trimmed = remainder.Length - tokenLength;
                }
            }
            return true;
        }
    }
}
