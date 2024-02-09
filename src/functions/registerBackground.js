import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const FETCH_TASKNAME = "notificationFetch";

export async function registerBackgroundFetchAsync() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    switch (status) {
      case BackgroundFetch.BackgroundFetchStatus.Restricted:
      case BackgroundFetch.BackgroundFetchStatus.Denied:
        console.log("Background execution is disabled");
        return;
      default: {
        console.log("Background execution allowed");

        let tasks = await TaskManager.getRegisteredTasksAsync();
        if (tasks.find((f) => f.taskName === FETCH_TASKNAME) == null) {
          console.log("Registering task");
          await BackgroundFetch.registerTaskAsync(FETCH_TASKNAME, {
            minimumInterval: 1, // 15 minutes
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
          });

          tasks = await TaskManager.getRegisteredTasksAsync();
          console.log("Registered tasks", tasks);
        } else {
          console.log("already registered");
          // if (
          //   BackgroundFetch.BackgroundFetchStatus.Available &&
          //   !TaskManager.isTaskDefined() &&
          //   (await TaskManager.isAvailableAsync())
          // ) {
          //   console.log("Creating New task");
          //   await BackgroundFetch.unregisterTaskAsync(FETCH_TASKNAME);
          //   await BackgroundFetch.registerTaskAsync(FETCH_TASKNAME, {
          //     minimumInterval: 1, // 15 minutes
          //     stopOnTerminate: false, // android only,
          //     startOnBoot: true, // android only
          //   });
          // }
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
