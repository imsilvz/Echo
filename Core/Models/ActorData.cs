using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Sharlayan.Core.Enums;
namespace Echo.Core.Models
{
    public class ActorData
    {
        public uint ID { get; set; }
        public string Name { get; set; }
        public Actor.Job Job { get; set; }
        private bool _update = true;

        public void SetUpdate(bool b)
        {
            _update = b;
        }

        public bool GetUpdate()
        {
            return _update;
        }
    }
}
