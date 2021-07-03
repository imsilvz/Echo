using System;
using System.IO;

using Echo.Core.Controllers;
namespace Echo 
{
    public class Program 
    {
        [STAThread]
        public static void Main(string[] args)
        {
            // Create Directory!
            var path = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            Directory.CreateDirectory($"{path}/Echo/cache");

            DataBroker.Instance.Initialize();
            var app = new App();
            app.Run();
        }
    }
}