# GeoTrajectoryHub-Geospatial-Trajectory-Visualization-Query-System

## Overview

GeoTrajectoryHub is an advanced geospatial data visualization platform focused on the trajectory of moving objects. By utilizing the power of Spark, Hadoop, and Scala, this platform enables users to visualize, analyze, and run complex queries on trajectory datasets, seamlessly transforming raw data into meaningful insights.

**"Mapping Motion: From Data to Visual Trajectory"**

Features

* **Trajectory Data Parsing:** Efficient parsing of JSON trajectory datasets into structured dataframes using Spark, with emphasis on attributes like vehicle_id, trajectory_id, timestamp, longitude, and latitude.
* **Spatiotemporal Queries:** Three core trajectory queries supported:
    * Spatial Range Query: Retrieves trajectory segments based on spatial boundaries.
    * SpatioTemporal Range Query: Enables querying based on both spatial and temporal boundaries.
    * KNN Query: Returns the K nearest trajectories based on the minimum distance between them.
* **Modern Frontend with React:** Responsive and user-friendly UI built with the popular React.js framework, complete with components for file uploads, map visualization, and trajectory animations.
* **Backend API with Flask:** Robust backend system with API endpoints supporting various spatial query functionalities.


## Technical Stack

* **Data Processing & Query:** Spark 3.0.3, Hadoop 2.7.7, and Java 1.8
* **Frontend:** React.js
* **Backend:** Scala
* **API:** Flask (Python)
* **Data Format:** JSON

## Project Structure

1. **Data Parsing:** Leveraging Spark's spark.read.option() for efficient parsing.
2. **Algorithms:** Implementation of trajectory queries to extract meaningful information from the dataset.
3. **API & Frontend:** React-based frontend interface integrated with a Flask backend to handle real-time data processing and visualization.

## Setup & Installation

1. **Prerequisites:**
* Ensure you have Spark and Hadoop installed.
* npm for the React frontend.
* Python with Flask for the backend.
2. **Installation Steps:** (brief steps like cloning the repo, setting up environment variables, etc.)
3. **Running the Platform:** Instructions on starting both frontend and backend servers.

## Screenshots

![Description Image](/Image.jpg)

## Contributing

While this project is primarily for showcasing, contributions or feedback are always welcomed. Create an issue or pull request, and it will be reviewed.