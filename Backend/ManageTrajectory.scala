
import org.apache.log4j.{Level, Logger}
import org.apache.spark.sql.functions.{col, explode, udf}
import org.apache.spark.sql.{DataFrame, SparkSession}
import org.locationtech.jts.geom.Geometry
import scala.collection.mutable.ListBuffer

object ManageTrajectory {

  Logger.getLogger("org.spark_project").setLevel(Level.WARN)
  Logger.getLogger("org.apache").setLevel(Level.WARN)
  Logger.getLogger("akka").setLevel(Level.WARN)
  Logger.getLogger("com").setLevel(Level.WARN)


  def loadTrajectoryData(spark: SparkSession, filePath: String): DataFrame =
    {
      // parse dataframe from json
      var df = spark.read.option("multiline", true).json(filePath)

      // explode all nested array and struct
      df = df.select(col("vehicle_id"), col("trajectory_id"), explode(col("trajectory")) as "trajectory")
        .selectExpr("vehicle_id", "trajectory_id", "trajectory.timestamp as timestamp", "trajectory.location[1] as lon", "trajectory.location[0] as lat")

      // df.createOrReplaceTempView("tempView")
      // val a = spark.sql("SELECT vehicle_id, ST_Point(CAST(lat AS Decimal(24,20)), CAST(lon AS Decimal(24,20))) as geom FROM tempView")

      df
    }


  def getSpatialRange(spark: SparkSession, dfTrajectory: DataFrame, latMin: Double, lonMin: Double, latMax: Double, lonMax: Double): DataFrame = {
    val checkLon = (lon: Double) => {
      var a = 1
      if (lon >= lonMin && lon <= lonMax) {
        a = 0;
      }
      a
    }
    val checkLonUDF = udf(checkLon)

    val checkLat = (lat: Double) => {
      var a = 1
      if (lat >= latMin && lat <= latMax) {
        a = 0;
      }
      a
    }
    val checkLatUDF = udf(checkLat)

    val dfValid = dfTrajectory.select(col("trajectory_id"), col("vehicle_id"), col("timestamp"), col("lat"), col("lon"),
      checkLatUDF(col("lat")).as("latcheck"), checkLonUDF(col("lon")).as("loncheck"))
    dfValid.createOrReplaceTempView("tempView")
    val result = spark.sql("SELECT trajectory_id, vehicle_id, timestamp, ST_Point(CAST(lat AS Decimal(24,20)), CAST(lon AS Decimal(24,20))) as location FROM tempView where  latcheck = 0 and loncheck = 0")


    result
  }


  def getSpatioTemporalRange(spark: SparkSession, dfTrajectory: DataFrame, timeMin: Long, timeMax: Long, latMin: Double, lonMin: Double, latMax: Double, lonMax: Double): DataFrame =
  {
    val checkTime = (time: Long) => {
      var a = 1
      if (time >= timeMin && time <= timeMax) {
        a = 0;
      }
      a
    }
    val checkTimeUDF = udf(checkTime)

    val checkLon = (lon: Double) => {
      var a = 1
      if (lon >= lonMin && lon <= lonMax) {
        a = 0;
      }
      a
    }
    val checkLonUDF = udf(checkLon)

    val checkLat = (lat: Double) => {
      var a = 1
      if (lat >= latMin && lat <= latMax) {
        a = 0;
      }
      a
    }
    val checkLatUDF = udf(checkLat)

    val dfValid = dfTrajectory.select(col("trajectory_id"), col("vehicle_id"), col("timestamp"), col("lat"), col("lon"),
      checkLatUDF(col("lat")).as("latcheck"), checkLonUDF(col("lon")).as("loncheck"), checkTimeUDF(col("timestamp")).as(("timecheck")))
    dfValid.createOrReplaceTempView("tempView")
    val result = spark.sql("SELECT trajectory_id, vehicle_id, timestamp, ST_Point(CAST(lat AS Decimal(24,20)), CAST(lon AS Decimal(24,20))) as location FROM tempView where  latcheck = 0 and loncheck = 0 and timecheck = 0")

    result
  }



  def getKNNTrajectory(spark: SparkSession, dfTrajectory: DataFrame, trajectoryId: Long, neighbors: Int): DataFrame =
  {
    dfTrajectory.createOrReplaceTempView("knnView")
    val result: DataFrame = spark.sql("SELECT t2.trajectory_id, Min(ST_Distance(ST_SetSRID(ST_Point(t1.lon,t1.lat),4326), ST_SetSRID(ST_Point(t2.lon,t2.lat),4326))) AS minDistance FROM knnView AS t1, knnView AS t2 WHERE t1.trajectory_id = % d AND t2.trajectory_id != % d GROUP BY t2.trajectory_id ORDER BY minDistance, t2.trajectory_id ASC LIMIT % d".format(trajectoryId, trajectoryId, neighbors).stripMargin).drop("minDistance")

    result
  }
}



