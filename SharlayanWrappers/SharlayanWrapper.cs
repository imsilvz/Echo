using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Collections.Concurrent;

using NLog;
using Sharlayan;
using Sharlayan.Enums;
using Sharlayan.Models;
namespace Echo.SharlayanWrappers
{
    public class SharlayanWrapper
    {
        private static Lazy<SharlayanWrapper> _instance = new Lazy<SharlayanWrapper>(() => new SharlayanWrapper());
        public static SharlayanWrapper Instance => _instance.Value;
        private readonly ConcurrentDictionary<int, WorkerSet> _workerSets = new ConcurrentDictionary<int, WorkerSet>();
        public SharlayanWrapper() { }

        public void Initialize()
        {
            SetupSharlayanManager();
            SetupWorkerSets();
            StartAllSharlayanWorkers();
        }

        private void Sharlayan_OnExceptionEvent(object sender, Logger logger, Exception ex)
        {
            if (sender is not MemoryHandler memoryHandler) { return; }
            if (ex.StackTrace is null) { return; }

            // According to Sharlayan: this should be handled in sharlayan; when we can detect character changes this will be updated/removed and placed in sharlayan
            if (ex.GetType() != typeof(OverflowException))
            {
                return;
            }

            SharlayanConfiguration configuration = memoryHandler.Configuration;
            if (!this._workerSets.TryGetValue(configuration.ProcessModel.ProcessID, out WorkerSet workerSet))
            {
                return;
            }
        }

        private void Sharlayan_OnMemoryHandlerDisposedEvent(object sender)
        {
            if (sender is not MemoryHandler memoryHandler)
            {
                return;
            }

            memoryHandler.OnException -= this.Sharlayan_OnExceptionEvent;
            memoryHandler.OnMemoryHandlerDisposed -= this.Sharlayan_OnMemoryHandlerDisposedEvent;

            if (this._workerSets.TryRemove(memoryHandler.Configuration.ProcessModel.ProcessID, out WorkerSet workerSet))
            {
                workerSet.StopMemoryWorkers();
            }
        }

        private void SetupSharlayanManager()
        {
            string patchVersion = "latest";
            GameRegion gameRegion = GameRegion.Global;
            GameLanguage gameLanguage = GameLanguage.English;
            string cacheDir = $"{Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)}/Echo/cache/";

            Process[] processes = Process.GetProcessesByName("ffxiv_dx11");
            foreach (Process process in processes)
            {
                SharlayanConfiguration configuration = new SharlayanConfiguration
                {
                    ProcessModel = new ProcessModel
                    {
                        Process = process
                    },
                    GameLanguage = gameLanguage,
                    GameRegion = gameRegion,
                    PatchVersion = patchVersion,
                    JSONCacheDirectory = cacheDir,
                    UseLocalCache = true,
                };
                MemoryHandler handler = SharlayanMemoryManager.Instance.AddHandler(configuration);

                handler.OnException += this.Sharlayan_OnExceptionEvent;
                handler.OnMemoryHandlerDisposed += this.Sharlayan_OnMemoryHandlerDisposedEvent;
            }
        }

        private void SetupWorkerSets()
        {
            ICollection<MemoryHandler> memoryHandlers = SharlayanMemoryManager.Instance.GetHandlers();
            foreach (MemoryHandler memoryHandler in memoryHandlers)
            {
                WorkerSet workerSet = new WorkerSet(memoryHandler);
                this._workerSets.AddOrUpdate(memoryHandler.Configuration.ProcessModel.ProcessID, workerSet, (k, v) => workerSet);
            }
        }

        private void StartAllSharlayanWorkers()
        {
            this.StopAllSharlayanWorkers();
            foreach (WorkerSet workerSet in this._workerSets.Values)
                workerSet.StartMemoryWorkers();
        }

        private void StopAllSharlayanWorkers()
        {
            foreach (WorkerSet workerSet in this._workerSets.Values)
                workerSet.StopMemoryWorkers();
        }
    }
}
