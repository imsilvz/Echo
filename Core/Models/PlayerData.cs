using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Sharlayan.Core.Enums;
namespace Echo.Core.Models
{
    public class PlayerData
    {
        public uint ID { get; set; }
        public string Name { get; set; }
        public uint TargetID { get; set; }
        public Actor.Type TargetType { get; set; }
        public string TargetName { get; set; }
    }
}
